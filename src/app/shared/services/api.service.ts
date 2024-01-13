import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Trip } from '../../trip';
import { Review } from '../../review';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = "http://localhost:8080/api/";
  // private readonly getTripsAction$ = new Subject();

  constructor(private http: HttpClient) {
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
    console.log("...")
    console.log(trip)
    return this.http.post<Trip>(this.url + "trips/", trip).pipe(
      catchError(this.handleError)
    );
  }

  readAllTrips() {
    // return this.getTripsAction$.pipe(
    //   startWith(''),
    //   concatMap(() => {
    //     return this.http.get<Trip[]>(this.url + "trips").pipe(
    //       retry(1),
    //       tap(() => this.getTripsAction$.next(true))
    //     );
    //   }),
    // )
    return this.http.get<Trip[]>(this.url + "trips/").pipe(
      catchError(this.handleError)
    );;
  }

  updateTrip(id: string, body: Object) {
    return this.http.put<Trip>(this.url + "trips/" + id, body).pipe(
      catchError(this.handleError)
    );;
  }

  deleteTrip(id: string) {
    return this.http.delete(this.url + "trips/" + id).pipe(
      catchError(this.handleError)
    );;
  }

  addReview(review: Review) {
    return this.http.post<Review>(this.url + "reviews/", review).pipe(
      catchError(this.handleError)
    );;
  }

  readAllReviews() {
    return this.http.get<Review[]>(this.url + "reviews/").pipe(
      catchError(this.handleError)
    );;
  }

  readReviewsByTrip(tripId: string) {
    return this.http.get<Review[]>(this.url + "reviews/" + tripId).pipe(
      catchError(this.handleError)
    );;
  }
}
