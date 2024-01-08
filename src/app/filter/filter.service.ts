import { Injectable } from '@angular/core';
import { Trip } from '../trip';
import { TripsService } from '../trips/trips.service';
import { Subject } from 'rxjs';

function parseDate(dateString: string) {
  const dateArr = dateString.split('.');
  return Date.parse(`${dateArr[1]}.${dateArr[0]}.${dateArr[2]}`);
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private countries: string[] = [];
  private costMin: number = 0;
  private costMax: number = Number.MAX_VALUE;
  private earliestStart: string = new Date().toLocaleDateString("pl");
  private latestEnd: string = new Date(Date.now() + 60000 * 60 * 24 * 365).toLocaleDateString("pl"); // + 1 year
  selectedRatingFrom: Subject<number> = new Subject();
  selectedRatingTo: Subject<number> = new Subject();
  selectedCostMin: Subject<number> = new Subject();
  selectedCostMax: Subject<number> = new Subject();
  selectedStart: Subject<string> = new Subject();
  selectedEnd: Subject<string> = new Subject();
  selectedCountry: Subject<string> = new Subject();
  trips: Trip[] = []

  constructor(private tripsService: TripsService) {
    this.tripsService.tripsSubject.subscribe((trips) => {
      this.trips = trips;
      this.setBounds(trips);
    })
    this.selectedRatingFrom.next(this.getMinRating());
    this.selectedRatingTo.next(this.getMaxRating());
    this.selectedCountry.next("All");
    this.selectedCostMin.next(this.getCostMin());
    this.selectedCostMax.next(this.getCostMax());
    this.selectedStart.next(this.getEarliestStart());
    this.selectedEnd.next(this.getLatestEnd());
  }

  setBounds(trips: Trip[]) {
    this.countries = [...new Set(trips.map((el) => el.country))];
    this.costMin = Math.min(...trips.map(el => el.cost));
    this.costMax = Math.max(...trips.map(el => el.cost));
    this.earliestStart = new Date(
      Math.min(...trips.map(el => parseDate(el.start)))
    ).toLocaleString('pl');
    this.latestEnd = new Date(
      Math.max(...trips.map(el => parseDate(el.end)))
    ).toLocaleString('pl');
  }

  getMinRating() {
    return this.trips.length ? Math.round(Math.min(...this.trips.map(el => el.rating))) : 0;
  }

  getMaxRating() {
    return this.trips.length ? Math.round(Math.max(...this.trips.map(el => el.rating))) : 5;
  }

  getCountries() {
    return this.countries;
  }

  getCostMin() {
    return this.costMin;
  }

  getCostMax() {
    return this.costMax;
  }

  getEarliestStart() {
    return this.earliestStart;
  }

  getLatestEnd() {
    return this.latestEnd;
  }

  setCountry(country: string) {
    this.selectedCountry.next(country);
  }
  setStart(start: string) {
    this.selectedStart.next(new Date(start).toLocaleDateString("pl"));
  }
  setEnd(end: string) {
    this.selectedEnd.next(new Date(end).toLocaleDateString("pl"));
  }
  setCostMin(costMin: number) {
    this.selectedCostMin.next(costMin);
  }
  setCostMax(costMax: number) {
    this.selectedCostMax.next(costMax);
  }
  setRatingFrom(value: number) {
    this.selectedRatingFrom.next(value);
  }
  setRatingTo(value: number) {
    this.selectedRatingTo.next(value);
  }
}
