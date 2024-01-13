import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, firstValueFrom, throwError } from 'rxjs';
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

  // TODO!
  reserveTrip(tripId: string) {
    let trips = structuredClone(this.trips);
    const trip = trips.find(el => el.id === tripId);
    if (!trip) { console.log("Error reserving trip"); return };
    if (trip.available > 0) {
      --trip.available;
      this.cartService.addToCart(trip);
      this.tripsSubject.next(trips);
    }
  }

  cancelTrip(tripId: string) {
    let trips = structuredClone(this.trips);
    const trip = trips.find(el => el.id === tripId);
    if (!trip) { console.log("Error cancelling trip"); return };
    if (trip.capacity > trip.available) {
      ++trip.available;
      this.cartService.removeFromCart(trip);
      this.tripsSubject.next(trips);
    }
  }

  isAvailable(tripId: string) {
    const trip = this.trips.find(el => el.id === tripId);
    if (trip) return trip.available > 0;
    else return false;
  }
}
