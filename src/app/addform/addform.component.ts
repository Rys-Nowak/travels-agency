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
  start: string = new Date().toLocaleDateString("pl");
  end: string = new Date().toLocaleDateString("pl");
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
    return /^[A-Za-z0-9,.-_'" ]*$/.test(this.description);
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
    return typeof this.cost === "number" && this.cost >= 0;
  }

  validateCapacity() {
    return typeof this.capacity === "number" && this.capacity >= 0 && !(this.capacity % 1);
  }

  validateAll() {
    return this.validateName() && this.validateCountry() && this.validateDescription() && this.validateUrl() && this.validateEndDate() && this.validateCost() && this.validateCapacity() && this.name && this.country && this.start && this.end;
  }

  addTrip() {
    if (this.validateAll()) {
      const newTrip: Trip = {
        name: this.name,
        country: this.country,
        start: new Date(this.start).toLocaleDateString("pl"),
        end: new Date(this.end).toLocaleDateString("pl"),
        cost: this.cost,
        capacity: this.capacity,
        description: this.description,
        img: this.img,
        available: this.capacity,
        rating: 0
      };
      this.tripsService.addTrip(newTrip);
      this.router.navigate(['trips']);
    } else {
      alert("Invalid data");
    }
  }
}
