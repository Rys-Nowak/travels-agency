import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router) { }

  validateUsername() {
    return /^[0-9A-Za-z]{6,16}$/.test(this.username);
  }

  validatePassword() {
    return /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
      .test(this.password);
  }

  login() {
    if (this.validateUsername() && this.validatePassword()) {
      this.authService.login({
        username: this.username,
        password: this.password
      })
    } else {
      alert("Invalid username or password");
    }
  }
}
