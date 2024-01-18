import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FirestoreService } from './firestore.service';
import { Trip } from '../../trip';
import { Review } from '../../review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  mode: string;

  constructor(private apiService: ApiService, private firestoreService: FirestoreService) {
    const local_mode = localStorage.getItem("dbMode");
    this.mode = local_mode ? local_mode.toString() : "api";
  }

  switchMode() {
    this.mode = this.mode === "api" ? "local" : "api";
    localStorage.setItem("dbMode", this.mode);
    window.location.reload();
  }

  createTrip(trip: Trip): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.createTrip(trip);
    } else if (this.mode === "local") {
      return this.firestoreService.createTrip(trip);
    }
    throw new Error("Invalid backend mode");
  }

  readAllTrips(): Observable<Trip[]> {
    if (this.mode === "api") {
      return this.apiService.readAllTrips();
    } else if (this.mode === "local") {
      return  this.firestoreService.readAllTrips();
    }
    throw new Error("Invalid backend mode");
  }

  updateTrip(id: string, body: Object): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.updateTrip(id, body);
    } else if (this.mode === "local") {
      return this.firestoreService.updateTrip(id, body);
    }
    throw new Error("Invalid backend mode");
  }

  deleteTrip(id: string): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.deleteTrip(id);
    } else if (this.mode === "local") {
      return this.firestoreService.deleteTrip(id);
    }
    throw new Error("Invalid backend mode");
  }

  addReview(review: Review): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.addReview(review);
    } else if (this.mode === "local") {
      return this.firestoreService.addReview(review);
    }
    throw new Error("Invalid backend mode");
  }

  readReviewsByTrip(tripId: string): Observable<Review[]> {
    if (this.mode === "api") {
      return this.apiService.readReviewsByTrip(tripId);
    } else if (this.mode === "local") {
      return this.firestoreService.readReviewsByTrip(tripId);
    }
    throw new Error("Invalid backend mode");
  }

  addToCart(tripId: string): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.addToCart(tripId);
    } else if (this.mode === "local") {
      return this.firestoreService.addToCart(tripId);
    }
    throw new Error("Invalid backend mode");
  }

  removeFromCart(tripId: string): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.removeFromCart(tripId);
    } else if (this.mode === "local") {
      return this.firestoreService.removeFromCart(tripId);
    }
    throw new Error("Invalid backend mode");
  }

  readCart(): Observable<any> {
    if (this.mode === "api") {
      return this.apiService.readCart();
    } else if (this.mode === "local") {
      return this.firestoreService.readCart();
    }
    throw new Error("Invalid backend mode");
  }
}
