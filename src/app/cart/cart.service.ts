import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { Subject, firstValueFrom } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { DbService } from '../shared/services/db.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  reservedTrips: Trip[] = [];
  reservedTripsSubject: Subject<Trip[]> = new Subject();
  checkedTrips: Trip[] = this.reservedTrips;
  checkedTripsSubject: Subject<Trip[]> = new Subject();

  constructor(private dbService: DbService, private authService: AuthService) {
    this.authService.isNotLoggedIn.subscribe((val) => {
      if (val === false) this.refresh();
    })
    this.checkedTripsSubject.subscribe((trips) => {
      this.checkedTrips = trips;
    });
    this.reservedTripsSubject.subscribe((trips) => {
      this.reservedTrips = trips;
      this.checkAll();
    });
  }

  refresh() {
    if (this.authService.currentUser.roles.includes("client")) {
      firstValueFrom(this.dbService.readCart())
        .then(data => this.reservedTripsSubject.next(data));
    }
  }

  buyTrips() {
    Promise.all(this.checkedTrips.map((trip) => {
      return this.removeFromCart(trip);
    })).then(() => {
      this.checkAll();
    })
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

  async addToCart(trip: Trip) {
    this.checkTrip(trip);
    await firstValueFrom(this.dbService.addToCart(trip.id));
    return this.refresh();
  }

  async removeFromCart(trip: Trip) {
    this.unCheckTrip(trip);
    await firstValueFrom(this.dbService.removeFromCart(trip.id));
    return this.refresh();
  }

  isInCart(tripId: string) {
    return this.reservedTrips.map(el => el.id).includes(tripId);
  }
}
