import { Component } from '@angular/core';
import { TripsService } from '../trips/trips.service';
import { Trip } from '../trip';
import { Router } from '@angular/router';

function parseDate(dateString: string) {
  const dateArr = dateString.split('.');
  return Date.parse(`${dateArr[1]}.${dateArr[0]}.${dateArr[2]}`);
}

@Component({
  selector: 'app-addform',
  templateUrl: './addform.component.html',
  styleUrl: './addform.component.css'
})
export class AddformComponent {
  name: string = "";
  country: string = "";
  start: string = "";
  end: string = "";
  cost: number = 0;
  capacity: number = 0;
  description: string = "";
  img: string = "";
  tripsService: TripsService;
  router: Router;

  constructor(router: Router, tripsService: TripsService) {
    this.router = router;
    this.tripsService = tripsService;
  }

  validateName() {
    return /^[A-Za-z ]*$/.test(this.name);
  }

  validateCountry() {
    return /^[A-Za-z ]*$/.test(this.country);
  }

  validateDescription() {
    return /^[A-Za-z0-9,.-_'"\?\! ]*$/.test(this.description);
  }

  validateUrl() {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(this.img) || this.img === "";
  }

  validateEndDate() {
    return parseDate(this.start) <= parseDate(this.end);
  }

  validateCost() {
    return Number.isFinite(this.cost) && this.cost >= 0;
  }

  validateCapacity() {
    return Number.isInteger(this.capacity) && this.capacity >= 0;
  }

  validateAll() {
    return this.validateName() && this.validateCountry() && this.validateDescription() && this.validateUrl() && this.validateEndDate() && this.validateCost() && this.validateCapacity() && this.name && this.country && this.start && this.end;
  }

  addTrip() {
    if (this.validateAll()) {
      const newTrip: Trip = {
        id: self.crypto.randomUUID().toString(),
        name: this.name,
        country: this.country,
        start: this.start,
        end: this.end,
        cost: this.cost,
        capacity: this.capacity,
        description: this.description,
        img: this.img,
        available: this.capacity,
        rating: 0
      };
      this.router.navigate(['trips']);
      this.tripsService.addTrip(newTrip)
        .then(() => window.location.reload());
    } else {
      alert("Invalid data");
    }
  }

  convertStart(date: string) {
    this.start = new Date(date).toLocaleDateString("pl");
  }
  convertEnd(date: string) {
    this.end = new Date(date).toLocaleDateString("pl");
  }
}
