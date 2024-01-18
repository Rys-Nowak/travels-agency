import { Injectable } from '@angular/core';
import { Trip } from '../../trip';
import { Review } from '../../review';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { catchError, from, map, throwError, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CartElement } from '../../cartElement';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  tripsCollection = this.db.collection("trips");
  reviewsCollection = this.db.collection("reviews");
  cartCollection = this.db.collection("cart");

  constructor(private db: AngularFirestore, private authService: AuthService) { }

  private isAdmin() {
    return this.authService.currentUser.roles.includes('admin');
  }

  private isManager() {
    return this.authService.currentUser.roles.includes('manager');
  }

  private isClient() {
    return this.authService.currentUser.roles.includes('client');
  }

  private handleError(error: HttpErrorResponse) {
    alert(error.error.message);
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  createTrip(trip: Trip) {
    if (!this.isAdmin() && !this.isManager())
      throw new Error("Unauthorized access");

    return from(this.tripsCollection
      .doc(trip.id)
      .set(trip)
      .catch((err) => this.handleError(err)));
  }

  readAllTrips() {
    return this.tripsCollection
      .get()
      .pipe(
        map(snap => snap.docs.map(doc => doc.data() as Trip)),
        catchError(this.handleError)
      );
  }

  updateTrip(id: string, body: Object) {
    if (!this.isAdmin() && !this.isManager() && !this.isClient())
      throw new Error("Unauthorized access");

    return this.tripsCollection
      .doc(id)
      .get()
      .pipe(
        map((docSnap) => {
          if (docSnap.exists) {
            this.tripsCollection
              .doc(id)
              .update(body)
              .then(() => {
                this.tripsCollection
                  .doc(id)
                  .get()
                  .pipe(
                    map((docSnap) => docSnap.data() as Trip),
                    catchError(this.handleError)
                  )
              })
              .catch((err) => this.handleError(err));
          } else {
            throw new Error("Trip not found");
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteTrip(id: string) {
    if (!this.isAdmin() && !this.isManager())
      throw new Error("Unauthorized access");

    return this.tripsCollection
      .doc(id)
      .get()
      .pipe(map((docSnap) => {
        if (!docSnap.exists) {
          throw Error("Trip not found");
        } else {
          this.tripsCollection
            .doc(id)
            .delete()
            .catch((err) => this.handleError(err));
        }
      }),
        catchError(this.handleError)
      )
  }

  addReview(review: Review) {
    if (!this.isClient())
      throw new Error("Unauthorized access");

    return from(this.reviewsCollection
      .doc(`${review.username}-${review.tripId}`)
      .set(review)
      .catch((err) => this.handleError(err)));
  }

  readReviewsByTrip(tripId: string) {
    return this.db.collection("reviews", ref => ref.where("tripId", "==", tripId))
      .get()
      .pipe(
        map(snapshot => snapshot.docs.map((doc) => doc.data() as Review)),
        catchError(this.handleError)
      );
  }

  addToCart(tripId: string) {
    if (!this.isClient())
      throw new Error("Unauthorized access");

    const cartElement = {
      username: this.authService.currentUser.username,
      tripId: tripId
    }
    return from(this.cartCollection
      .add(cartElement)
      .catch((err) => this.handleError(err)));
  }

  removeFromCart(tripId: string) {
    if (!this.isClient())
      throw new Error("Unauthorized access");

    return this.db.collection("cart", ref =>
      ref.where("username", "==", this.authService.currentUser.username).where("tripId", "==", tripId).limit(1)
    )
      .get()
      .pipe(
        map((querySnap) => {
          querySnap.forEach((doc) => doc.ref.delete())
        }),
        catchError(this.handleError)
      )
  }

  readCart() {
    if (!this.isClient())
      throw new Error("Unauthorized access");

    return this.db.collection("cart", ref => ref.where("username", "==", this.authService.currentUser.username))
      .get()
      .pipe(
        map(snapshot =>
          Promise.all(snapshot.docs.map((doc) => {
            const tripId = (doc.data() as CartElement).tripId;
            return firstValueFrom(this.tripsCollection
              .doc(tripId)
              .get())
              .then(doc => doc.data())
              .catch((err) => this.handleError(err));
          }))
        ),
        catchError(this.handleError)
      )
  }
}
