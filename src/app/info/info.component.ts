import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  nReserved: number = 0;
  totalValue: number = 0;

  constructor(private cartService: CartService) {
    this.cartService.reservedTripsSubject.subscribe((value) => {
      this.nReserved = value.length;
      this.totalValue = 0;
      for (const cost of value.map(el => el.cost)) {
        this.totalValue += cost;
      }
    })
  }

}