import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { Subject, firstValueFrom } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { DbService } from '../shared/services/db.service';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  tripsSubject: Subject<Trip[]> = new Subject();
  trips: Trip[] = [];

  constructor(private cartService: CartService, private dbService: DbService) {
    this.tripsSubject.subscribe((trips) => {
      this.trips = trips;
    });
    this.refresh();
  }

  refresh() {
    firstValueFrom(this.dbService.readAllTrips()).then(
      data => {
        this.tripsSubject.next(data);
      }
    );
  }

  async addTrip(trip: Trip) {
    await firstValueFrom(this.dbService.createTrip(trip));
    return this.refresh();
  }

  async removeTrip(trip: Trip) {
    await firstValueFrom(this.dbService.deleteTrip(trip.id));
    return this.refresh();
  }

  async updateTrip(tripId: string, obj: Object) {
    await firstValueFrom(this.dbService.updateTrip(tripId, obj));
    return this.refresh();
  }

  reserveTrip(tripId: string) {
    const trip = this.trips.find(el => el.id === tripId);
    if (!trip) { console.error("Error reserving trip"); return; };
    if (trip.available > 0) {
      this.cartService.addToCart(trip).then(() => {
        this.updateTrip(tripId, { available: trip.available - 1 });
      });
    }
  }

  cancelTrip(tripId: string) {
    const trip = this.trips.find(el => el.id === tripId);
    if (!trip) { console.error("Error cancelling trip"); return };
    if (trip.capacity > trip.available) {
      this.cartService.removeFromCart(trip).then(() => {
        this.updateTrip(tripId, { available: trip.available + 1 });
      });
    }
  }

  isAvailable(tripId: string) {
    const trip = this.trips.find(el => el.id === tripId);
    if (trip) return trip.available > 0;
    else return false;
  }
}
