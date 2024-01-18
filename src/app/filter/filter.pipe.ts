import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../trip';

function parseDate(dateString: string) {
  const dateArr = dateString.split('.');
  return Date.parse(`${dateArr[1]}.${dateArr[0]}.${dateArr[2]}`);
}

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(trips: Trip[], countries: string[], costMin: number, costMax: number, start: string, end: string, ratingFrom: number, ratingTo: number): Trip[] {
    return trips.filter((trip: Trip) => {
      if (!countries.includes(trip.country)) return false;
      if (trip.cost > costMax || trip.cost < costMin) return false;
      if (parseDate(trip.start) < parseDate(start)) return false;
      if (parseDate(trip.end) > parseDate(end)) return false;
      if (Math.round(trip.rating) < ratingFrom || Math.round(trip.rating) > ratingTo) return false;
      return true;
    })
  }
}
