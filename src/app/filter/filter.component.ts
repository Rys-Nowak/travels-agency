import { Component } from '@angular/core';
import { FilterService } from './filter.service';
import { TripsService } from '../trips/trips.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  selectedRatings: number[];
  selectedCostMin: number;
  selectedCostMax: number;
  selectedStart: string;
  selectedEnd: string;
  selectedCountry: string = "All";
  filtersOn: boolean = false

  constructor(public filterService: FilterService, public tripsService: TripsService) {
    this.selectedRatings = this.filterService.getAllRatings();
    this.selectedCostMin = this.filterService.getCostMin();
    this.selectedCostMax = this.filterService.getCostMax();
    this.selectedStart = this.filterService.getEarliestStart();
    this.selectedEnd = this.filterService.getLatestEnd();
  }

  getInfinity() {
    return Number.MAX_VALUE;
  }

  switchFilters() {
    this.filtersOn = !this.filtersOn;
  }
}
