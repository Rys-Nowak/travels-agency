import { Component, OnInit } from '@angular/core';
import { Trip } from '../trip';
import { TripsService } from './trips.service';
import { CurrencyService } from '../shared/services/currency.service';
import { FilterService } from '../filter/filter.service';
import { CartService } from '../cart/cart.service';
import { FilterPipe } from '../filter/filter.pipe';

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
  trips: Trip[] = this.tripsService.trips;
  tripsPage: Trip[] = this.tripsService.trips.slice((this.currentPage - 1) * this.itemsPerPage, this.itemsPerPage);
  totalPages = this.calculateTotalPages();

  constructor(public tripsService: TripsService, public currencyService: CurrencyService, public filterService: FilterService, public cartService: CartService, private filterPipe: FilterPipe) {
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filterTrips();
    this.sliceTrips();
  }

  ngOnInit(): void {
    this.tripsService.tripsSubject.subscribe((trips) => {
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedCountries.subscribe((val) => {
      this.countriesFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedCostMin.subscribe((val) => {
      this.costMinFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedCostMax.subscribe((val) => {
      this.costMaxFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedStart.subscribe((val) => {
      this.startFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedEnd.subscribe((val) => {
      this.endFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedRatingFrom.subscribe((val) => {
      this.ratingFromFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedRatingTo.subscribe((val) => {
      this.ratingToFilter = val;
      this.filterTrips();
      this.sliceTrips();
    })
    this.filterService.selectedCountries.subscribe((val) => {
      this.countriesFilter = val;
      this.filterTrips();
      this.sliceTrips();
    });
  }

  calculateTotalPages() {
    return Math.ceil(this.trips.length / this.itemsPerPage);
  }

  filterTrips() {
    this.trips = this.filterPipe.transform(
      this.tripsService.trips,
      this.countriesFilter,
      this.costMinFilter,
      this.costMaxFilter,
      this.startFilter,
      this.endFilter,
      this.ratingFromFilter,
      this.ratingToFilter
    );
    this.totalPages = this.calculateTotalPages();
  }

  sliceTrips() {
    this.tripsPage = this.trips.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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
