import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TripsService } from '../trips/trips.service';
import { AuthService } from '../shared/services/auth.service';
import { DbService } from '../shared/services/db.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private dbService: DbService, private tripsService: TripsService, private authService: AuthService) { }

  async setRate(tripId: string, rate: number): Promise<number> {
    await firstValueFrom(this.dbService.addReview({
      username: this.authService.currentUser.username,
      rate: rate,
      tripId: tripId,
    }))
    const reviews = await firstValueFrom(this.dbService.readReviewsByTrip(tripId));
    let sum = 0;
    for (const val of reviews.map(el => el.rate)) {
      sum += val;
    }
    const newRating = sum / reviews.length;
    this.tripsService.updateTrip(tripId, {rating: newRating});
    return newRating;
  }

  async getMyRate(tripId: string): Promise<number> {
    const reviews = await firstValueFrom(this.dbService.readReviewsByTrip(tripId));
    const review = reviews.find(el => el.username === this.authService.currentUser.username);
    return review ? review.rate : 0;
  }
}
