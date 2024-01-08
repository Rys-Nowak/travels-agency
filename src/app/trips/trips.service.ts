import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  tripsSubject: Subject<Trip[]> = new Subject();
  trips: Trip[] = [];

  constructor(private httpClient: HttpClient) {
    this.tripsSubject.next([]);
    this.tripsSubject.subscribe((trips) => {
      this.trips = trips;
    });
    this.httpClient.get<Trip[]>("assets/trips.json").subscribe((data) => {
      this.tripsSubject.next([...this.trips, ...data.map((el) => {
        el.available = el.capacity;
        return el;
      })]);
    });
  }

  addTrip(trip: Trip) {
    this.tripsSubject.next([trip, ...this.trips]);
  }

  removeTrip(trip: Trip) {
    let trips = structuredClone(this.trips);
    trips.splice(this.trips.indexOf(trip), 1);
    this.tripsSubject.next(trips);
  }

  removeRate(tripId: number, rate: number): number {
    let trips = structuredClone(this.trips);
    const tripIndex = trips.findIndex(el => el.id === tripId);
    let newRating;
    if (trips[tripIndex].ratingsCount > 1) {
      newRating = (trips[tripIndex].rating * trips[tripIndex].ratingsCount - rate) / (trips[tripIndex].ratingsCount - 1)
    } else {
      newRating = 0;
    }
    trips[tripIndex].rating = newRating;
    trips[tripIndex].ratingsCount--;
    trips[tripIndex].rate = 0;
    this.tripsSubject.next(trips);
    return newRating;
  }

  addRate(tripId: number, rate: number): number {
    let trips = structuredClone(this.trips);
    const tripIndex = trips.findIndex(el => el.id === tripId);
    let newRating = (trips[tripIndex].ratingsCount * trips[tripIndex].rating + rate) / (trips[tripIndex].ratingsCount + 1)
    trips[tripIndex].rating = newRating;
    trips[tripIndex].ratingsCount++;
    trips[tripIndex].rate = rate;
    this.tripsSubject.next(trips);
    return newRating;
  }
}
