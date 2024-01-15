import { Component } from '@angular/core';
import { CurrencyService } from '../shared/services/currency.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  modes: string[] = [
    "local", "session", "none"
  ];
  selectedMode: string = this.authService.persistance;

  constructor(public currencyService: CurrencyService, public authService: AuthService) {
    
  }

  changeMode(mode: string) {
    this.authService.persistance = mode;
  }
}
