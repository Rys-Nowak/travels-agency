import { Component } from '@angular/core';
import { Trip } from '../trip';
import { TripsService } from './trips.service';
import { CurrencyService } from '../currency.service';
import { FilterService } from '../filter/filter.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent {
  currencyCounter: number = 0;
  currencies: string[] = ['PLN', 'USD', 'EUR', 'GBP'];
  countryFilter: string = "All";
  costMinFilter: number = this.filterService.getCostMin();
  costMaxFilter: number = this.filterService.getCostMax();
  startFilter: string = this.filterService.getEarliestStart();
  endFilter: string = this.filterService.getLatestEnd();
  trips: Trip[] = [];

  constructor(public tripsService: TripsService, public currencyService: CurrencyService, public filterService: FilterService) {
    this.tripsService.tripsSubject.subscribe((trips) => {
      this.trips = trips;
    })
    this.filterService.selectedCountry.subscribe((val) => {
      this.countryFilter = val;
    })
    this.filterService.selectedCostMin.subscribe((val) => {
      this.costMinFilter = val;
    })
    this.filterService.selectedCostMax.subscribe((val) => {
      this.costMaxFilter = val;
    })
    this.filterService.selectedStart.subscribe((val) => {
      this.startFilter = val;
    })
    this.filterService.selectedEnd.subscribe((val) => {
      this.endFilter = val;
    })
  }

  reserveTrip(trip: Trip) {
    if (trip.available > 0) --trip.available;
  }

  cancelTrip(trip: Trip) {
    if (trip.capacity > trip.available) ++trip.available;
  }

  getMaxCost() {
    return Math.max(...this.trips.map(e => e.cost))
  }

  getMinCost() {
    return Math.min(...this.trips.map(e => e.cost))
  }

  convertCurrency(value: number) {
    return this.currencyService.convertPln(value, this.currencies[this.currencyCounter])
  }

  switchCurrency() {
    ++this.currencyCounter;
    this.currencyCounter %= 4;
  }

  removeTrip(trip: Trip) {
    this.tripsService.removeTrip(trip);
  }

  addTrip(trip: Trip) {
    this.tripsService.addTrip(trip);
  }
}
