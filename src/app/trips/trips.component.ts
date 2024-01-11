import { Component, OnInit } from '@angular/core';
import { Trip } from '../trip';
import { TripsService } from './trips.service';
import { CurrencyService } from '../currency.service';
import { FilterService } from '../filter/filter.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  countriesFilter: string[] = this.filterService.getCountries();
  costMinFilter: number = this.filterService.getCostMin();
  costMaxFilter: number = this.filterService.getCostMax();
  startFilter: string = this.filterService.getEarliestStart();
  endFilter: string = this.filterService.getLatestEnd();
  ratingFromFilter: number = this.filterService.getMinRating();
  ratingToFilter: number = this.filterService.getMaxRating();
  currentPage = 1;
  itemsPerPage = 5;
  trips: Trip[] = this.tripsService.trips.slice((this.currentPage - 1) * this.itemsPerPage, this.itemsPerPage);

  constructor(public tripsService: TripsService, public currencyService: CurrencyService, public filterService: FilterService, public cartService: CartService) {
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.trips = this.tripsService.trips.slice((page - 1) * this.itemsPerPage, page * this.itemsPerPage);
  }

  ngOnInit(): void {
    this.tripsService.tripsSubject.subscribe((trips) => {
      this.trips = trips.slice((this.currentPage - 1) * this.itemsPerPage, this.itemsPerPage);
    })
    this.filterService.selectedCountries.subscribe((val) => {
      this.countriesFilter = val;
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
    this.filterService.selectedRatingFrom.subscribe((val) => {
      this.ratingFromFilter = val;
    })
    this.filterService.selectedRatingTo.subscribe((val) => {
      this.ratingToFilter = val;
    })
    this.filterService.selectedCountries.subscribe((val) => {
      this.countriesFilter = val;
    });
    this.filterService.selectedCountries.subscribe((val) => {
      this.countriesFilter = val;
    });
  }

  reserveTrip(trip: Trip) {
    this.tripsService.reserveTrip(trip.id);
  }

  cancelTrip(trip: Trip) {
    this.tripsService.cancelTrip(trip.id);
  }

  getMaxCost() {
    return Math.max(...this.tripsService.trips.map(e => e.cost))
  }

  getMinCost() {
    return Math.min(...this.tripsService.trips.map(e => e.cost))
  }

  removeTrip(trip: Trip) {
    this.tripsService.removeTrip(trip);
  }

  addTrip(trip: Trip) {
    this.tripsService.addTrip(trip);
  }
}
