import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';

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
}
