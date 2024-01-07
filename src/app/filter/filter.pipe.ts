import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../trip';

function parseDate(dateString: string) {
  const dateArr = dateString.split('.');
  return Date.parse(`${dateArr[1]}.${dateArr[0]}.${dateArr[2]}`);
}

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(trips: Trip[], country: string, costMin: number, costMax: number, start: string, end: string): Trip[] {
    return trips.filter((trip: Trip) => {
      if (country !== "All" && trip.country !== country) return false;
      if (trip.cost > costMax || trip.cost < costMin) return false;
      if (parseDate(trip.start) < parseDate(start)) return false;
      if (parseDate(trip.end) > parseDate(end)) return false;
      return true;
    })
  }
}
