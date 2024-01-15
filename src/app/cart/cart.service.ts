import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { Subject, firstValueFrom } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  reservedTrips: Trip[] = [];
  reservedTripsSubject: Subject<Trip[]> = new Subject();
  checkedTrips: Trip[] = this.reservedTrips;

  constructor(private apiService: ApiService, private authService: AuthService) {
    authService.refreshToken().then(() => firstValueFrom(this.apiService.readCart()))
      .then((data) => {
        this.reservedTripsSubject.next(data);
      });
    this.reservedTripsSubject.subscribe((trips) => {
      this.reservedTrips = trips;
    });
    this.checkAll();
  }

  buyTrips() {
    Promise.all(this.checkedTrips.map((trip) => {
      return firstValueFrom(this.removeFromCart(trip));
    })).then(() => {
      this.checkAll();
    })
  }

  checkTrip(trip: Trip) {
    this.checkedTrips = [trip, ...this.checkedTrips];
  }

  checkAll() {
    this.checkedTrips = this.reservedTrips;
  }

  unCheckTrip(trip: Trip) {
    let checkedTrips = structuredClone(this.checkedTrips);
    const index = this.checkedTrips.findIndex(el => el.id === trip.id);
    if (index > -1) {
      checkedTrips.splice(index, 1);
      this.checkedTrips = checkedTrips;
    }
  }

  addToCart(trip: Trip) {
    this.checkTrip(trip);
    this.reservedTripsSubject.next([trip, ...this.reservedTrips]);
    return this.apiService.addToCart(trip.id);
  }

  removeFromCart(trip: Trip) {
    this.unCheckTrip(trip);
    let reservedTrips = structuredClone(this.reservedTrips);
    const index = this.reservedTrips.findIndex(el => el.id === trip.id);
    if (index > -1) {
      reservedTrips.splice(index, 1);
      this.reservedTripsSubject.next(reservedTrips);
    }
    return this.apiService.removeFromCart(trip.id);
  }

  isInCart(tripId: string) {
    return this.reservedTrips.map(el => el.id).includes(tripId);
  }
}
