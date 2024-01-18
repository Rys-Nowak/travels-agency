import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { CurrencyService } from '../shared/services/currency.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  nReserved: number = 0;
  totalValue: number = 0;

  constructor(private cartService: CartService, public currencyService: CurrencyService, public authService: AuthService) {
    this.cartService.reservedTripsSubject.subscribe((value) => {
      this.nReserved = value.length;
      this.totalValue = 0;
      for (const cost of value.map(el => el.cost)) {
        this.totalValue += cost;
      }
    })
  }
}
