import { Component, Input } from '@angular/core';
import { RatingService } from './rating.service';
import { Trip } from '../trip';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  rating: number = 0;
  ratingService: RatingService;
  @Input('trip') trip: Trip | null = null;

  constructor(ratingService: RatingService) {
    this.ratingService = ratingService;
  }

  setRating() {
    // TODO
  }

  setFirst() {
    this.rating = 1;
  }

  getFirstSrc() {
    if (this.rating >= 1) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  setSecond() {
    this.rating = 2;
  }

  getSecondSrc() {
    if (this.rating >= 2) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  setThird() {
    this.rating = 3;
  }

  getThirdSrc() {
    if (this.rating >= 3) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  setFourth() {
    this.rating = 4;
  }

  getFourthSrc() {
    if (this.rating >= 4) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }

  setFifth() {
    this.rating = 5;
  }

  getFifthSrc() {
    if (this.rating >= 5) {
      return '../../assets/star-fill.svg'
    } else {
      return '../../assets/star.svg'
    }
  }
}
