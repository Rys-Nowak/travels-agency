import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { Trip } from '../trip';
import { TripsService } from '../trips/trips.service';
import { CurrencyService } from '../shared/services/currency.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  trips: Trip[] = this.cartService.reservedTrips;
  totalValue: number;

  constructor(private cartService: CartService, private tripsService: TripsService, public currencyService: CurrencyService) {
    this.totalValue = this.calculateTotalValue();
    this.cartService.reservedTripsSubject.subscribe((value) => {
      this.totalValue = this.calculateTotalValue();
      this.trips = value;
    })
    this.cartService.checkedTripsSubject.subscribe((trips) => {
      this.totalValue = 0;
      for (const cost of trips.map(el => el.cost)) {
        this.totalValue += cost;
      }
    })
  }

  handleCheckbox(event: any, trip: Trip) {
    if (event.target?.checked) {
      this.cartService.checkTrip(trip);
    } else {
      this.cartService.unCheckTrip(trip);
    }
    this.totalValue = this.calculateTotalValue();
  }

  isTripAvailable(tripId: string) {
    return this.tripsService.isAvailable(tripId);
  }

  reserveTrip(trip: Trip) {
    this.tripsService.reserveTrip(trip.id);
  }

  cancelTrip(trip: Trip) {
    this.tripsService.cancelTrip(trip.id);
  }

  private calculateTotalValue() {
    let totalValue = 0;
    for (const cost of this.cartService.checkedTrips.map(el => el.cost)) {
      totalValue += cost;
    }
    return totalValue;
  }

  buyTrips() {
    if (this.cartService.checkedTrips.length) {
      alert(`You successfully bought ${this.cartService.checkedTrips.length} trips of total value ${this.currencyService.convertCurrency(this.totalValue)} ${this.currencyService.currency}!`);
      this.cartService.buyTrips();
      this.cartService.checkAll();
      this.totalValue = this.calculateTotalValue();
    }
    else {
      alert("No trips to buy!");
    }
  }
}
