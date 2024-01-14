import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { ApiService } from '../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  tripsSubject: Subject<Trip[]> = new Subject();
  trips: Trip[] = [];

  constructor(private httpClient: HttpClient, private cartService: CartService, private apiService: ApiService) {
    this.tripsSubject.next([]);
    this.tripsSubject.subscribe((trips) => {
      this.trips = trips;
    });
    this.refresh();
  }

  refresh() {
    firstValueFrom(this.apiService.readAllTrips()).then(
      data => {
        this.tripsSubject.next(data);
      }
    );
  }

  addTrip(trip: Trip) {
    firstValueFrom(this.apiService.createTrip(trip)).then(() => this.refresh());
  }

  removeTrip(trip: Trip) {
    firstValueFrom(this.apiService.deleteTrip(trip.id)).then(() => this.refresh());
  }

  updateTrip(tripId: string, obj: Object) {
    firstValueFrom(this.apiService.updateTrip(tripId, obj)).then(() => this.refresh());
  }

  reserveTrip(tripId: string) {
    const trip = this.trips.find(el => el.id === tripId);
    if (!trip) { console.log("Error reserving trip"); return; };
    if (trip.available > 0) {
      firstValueFrom(this.cartService.addToCart(trip)).then(() => {
        this.updateTrip(tripId, { available: trip.available - 1 });
      });
    }
  }

  cancelTrip(tripId: string) {
    const trip = this.trips.find(el => el.id === tripId);
    if (!trip) { console.log("Error cancelling trip"); return };
    if (trip.capacity > trip.available) {
      firstValueFrom(this.cartService.removeFromCart(trip)).then(() => {
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
