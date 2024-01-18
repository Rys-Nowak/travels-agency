import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { DbService } from '../shared/services/db.service';

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

  constructor(public authService: AuthService, public dbService: DbService) {
    authService.persistanceSubject.subscribe((value) => {
      this.selectedMode = value;
    })
  }

  changeMode(mode: string) {
    this.authService.setPersistanceMode(mode);
  }

  switchDatabase() {
    this.dbService.switchMode()
  }
}
