import { Component, Input } from '@angular/core';
import { Trip } from '../trip';
import { TripsService } from '../trips/trips.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  @Input('trip') trip: Trip | null = null;

  constructor(private tripsService: TripsService) {
  }

  setRating(rate: number) {
    if (this.trip) {
      if (this.trip.rate) {
        this.tripsService.removeRate(this.trip.id, this.trip.rate);
      }
      this.tripsService.addRate(this.trip.id, rate);
    }
  }

  getFirstSrc() {
    if (this.trip && this.trip.rating >= 0.5) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  getSecondSrc() {
    if (this.trip && this.trip.rating >= 1.5) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  getThirdSrc() {
    if (this.trip && this.trip.rating >= 2.5) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  getFourthSrc() {
    if (this.trip && this.trip.rating >= 3.5) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  getFifthSrc() {
    if (this.trip && this.trip.rating >= 4.5) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }
}
