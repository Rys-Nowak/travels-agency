import { Component } from '@angular/core';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public currencyService: CurrencyService) {

  }
}
