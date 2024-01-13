import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  reservedTrips: Trip[] = [];
  reservedTripsSubject: Subject<Trip[]> = new Subject();
  checkedTrips: Trip[] = this.reservedTrips;
  checkedTripsSubject: Subject<Trip[]> = new Subject();

  constructor() {
    this.reservedTripsSubject.next([]);
    this.reservedTripsSubject.subscribe((trips) => {
      this.reservedTrips = trips;
    });
    this.checkAll();
    this.checkedTripsSubject.subscribe((trips) => {
      this.checkedTrips = trips;
    });
  }

  buyTrips() {
    for (const trip of this.checkedTrips) {
      this.removeFromCart(trip)
    }
    this.checkAll();
  }

  checkTrip(trip: Trip) {
    this.checkedTripsSubject.next([trip, ...this.checkedTrips]);
  }

  checkAll() {
    this.checkedTripsSubject.next(this.reservedTrips);
  }

  unCheckTrip(trip: Trip) {
    let checkedTrips = structuredClone(this.checkedTrips);
    const index = this.checkedTrips.findIndex(el => el.id === trip.id);
    if (index > -1) {
      checkedTrips.splice(index, 1);
      this.checkedTripsSubject.next(checkedTrips);
    }
  }

  addToCart(trip: Trip) {
    this.checkTrip(trip);
    this.reservedTripsSubject.next([trip, ...this.reservedTrips]);
  }

  removeFromCart(trip: Trip) {
    this.unCheckTrip(trip);
    let reservedTrips = structuredClone(this.reservedTrips);
    const index = this.reservedTrips.findIndex(el => el.id === trip.id);
    if (index > -1) {
      reservedTrips.splice(index, 1);
      this.reservedTripsSubject.next(reservedTrips);
    }
  }

  isInCart(tripId: string) {
    return this.reservedTrips.map(el => el.id).includes(tripId);
  }
}
