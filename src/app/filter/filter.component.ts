import { Component } from '@angular/core';
import { FilterService } from './filter.service';
import { TripsService } from '../trips/trips.service';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  selectedRatingFrom: number;
  selectedRatingTo: number;
  selectedCostMin: number;
  selectedCostMax: number;
  selectedStart: string;
  selectedEnd: string;
  filtersOn: boolean = false
  countries: string[] = this.filterService.getCountries();
  selectedCountries: string[] = structuredClone(this.countries)

  constructor(public filterService: FilterService, public tripsService: TripsService, private currencyService: CurrencyService) {
    this.selectedRatingFrom = this.filterService.getMinRating();
    this.selectedRatingTo = this.filterService.getMaxRating();
    this.selectedCostMin = this.filterService.getCostMin();
    this.selectedCostMax = this.filterService.getCostMax();
    this.selectedStart = this.filterService.getEarliestStart();
    this.selectedEnd = this.filterService.getLatestEnd();
    this.tripsService.tripsSubject.subscribe(() => {
      this.selectedRatingFrom = this.filterService.getMinRating();
      this.selectedRatingTo = this.filterService.getMaxRating();
      this.selectedCostMin = this.filterService.getCostMin();
      this.selectedCostMax = this.filterService.getCostMax();
      this.selectedStart = this.filterService.getEarliestStart();
      this.selectedEnd = this.filterService.getLatestEnd();
      this.countries = this.filterService.getCountries();
    });
    this.filterService.selectedCountries.subscribe((val) => {
      this.selectedCountries = val;
    })
  }

  getInfinity() {
    return Number.MAX_VALUE;
  }

  switchFilters() {
    this.filtersOn = !this.filtersOn;
  }

  convertCurrency(val: number) {
    return Math.round(this.currencyService.convertCurrency(val))
  }

  handleCheck(event: any, country: string) {
    if (event.target?.checked) {
      this.filterService.setCountries([...new Set([...this.selectedCountries, country])]);
    } else {
      let countries = structuredClone(this.selectedCountries);
      countries.splice(countries.indexOf(country), 1)
      this.filterService.setCountries(countries);
    }
  }
}
