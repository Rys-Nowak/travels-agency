import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import { TripsService } from '../trips/trips.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private apiService: ApiService, private tripsService: TripsService) { }

  async setRate(tripId: string, rate: number): Promise<number> {
    await firstValueFrom(this.apiService.addReview({
      username: "test",
      rate: rate,
      tripId: tripId,
    }))
    const reviews = await firstValueFrom(this.apiService.readReviewsByTrip(tripId));
    let sum = 0;
    for (const val of reviews.map(el => el.rate)) {
      sum += val;
    }
    const newRating = sum / reviews.length;
    await firstValueFrom(this.apiService.updateTrip(tripId, {rating: newRating}));
    this.tripsService.refresh();
    return newRating;
  }

  async getMyRate(tripId: string): Promise<number> {
    const reviews = await firstValueFrom(this.apiService.readReviewsByTrip(tripId));
    const review = reviews.find(el => el.username === "test");
    return review ? review.rate : 0;
  }
}
