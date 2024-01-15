import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Trip } from '../../trip';
import { Review } from '../../review';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "http://localhost:8080/api/";

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  createTrip(trip: Trip) {
    return this.http.post<Trip>(this.url + "trips/", trip, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  readAllTrips() {
    return this.http.get<Trip[]>(this.url + "trips/").pipe(
      catchError(this.handleError)
    );
  }

  updateTrip(id: string, body: Object) {
    return this.http.put<Trip>(this.url + "trips/" + id, body, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTrip(id: string) {
    return this.http.delete(this.url + "trips/" + id, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addReview(review: Review) {
    return this.http.post<Review>(this.url + "reviews/", review, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  readAllReviews() {
    return this.http.get<Review[]>(this.url + "reviews/", { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  readReviewsByTrip(tripId: string) {
    return this.http.get<Review[]>(this.url + "reviews/" + tripId, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  addToCart(tripId: string) {
    return this.http.post<Trip>(this.url + "cart/", { tripId: tripId }, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  removeFromCart(tripId: string) {
    return this.http.delete(this.url + "cart/" + tripId, { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  readCart() {
    return this.http.get<Trip[]>(this.url + "cart/", { headers: this.authService.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
}
