import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { UserCredentials } from '../../userCredentials';
import { Tokens } from '../../tokens';
import { Router } from '@angular/router';
import { UserDto } from '../../userDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = "http://localhost:8080/api/";
  persistance: string = "none";
  persistanceSubject: Subject<string> = new Subject();
  token: string;
  refresh: string;
  currentUser: UserDto;
  isNotLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(true)
  interval: ReturnType<typeof setInterval> | null = null

  constructor(private http: HttpClient, private router: Router) {
    this.persistanceSubject.subscribe((value) => {
      this.persistance = value;
    })
    this.isNotLoggedIn.subscribe((value) => {
      if (value === false) {
        this.setRefreshing();
      }
    })
    this.token = "";
    this.refresh = "";
    this.currentUser = {
      username: "",
      roles: ["guest"]
    }
    firstValueFrom(this.readPersistanceMode());
  }

  private readPersistanceMode() {
    return this.http.get<{ mode: string }>(this.url + "persistance").pipe(
      tap((res) => {
        this.persistanceSubject.next(res.mode);
        this.getTokensfromSession();
      }),
      catchError(this.handleError)
    );
  }

  async setPersistanceMode(value: string) {
    return firstValueFrom(this.http.post<{ mode: string; }>(this.url + "persistance", { mode: value }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      )).then((res) => this.persistanceSubject.next(res.mode));
  }

  private setRefreshing() {
    this.interval = setInterval(() => {
      if (this.currentUser.username) this.refreshToken();
    }, 8 * 1000);
  }

  async refreshToken() {
    const res = await firstValueFrom(this.http.post<{ token: string; }>(this.url + "auth/refresh/", { username: this.currentUser.username, refresh: this.refresh }).pipe(
      catchError(this.handleError)
    ));
    return this.token = res.token.split(" ")[1];
  }

  private getTokensfromSession() {
    if (this.persistance === "local") {
      this.token = localStorage.getItem("token") ?? "";
      this.refresh = localStorage.getItem("refresh") ?? "";
      this.currentUser.username = localStorage.getItem("username") ?? "";
    } else if (this.persistance === "session") {
      this.token = sessionStorage.getItem("token") ?? "";
      this.refresh = sessionStorage.getItem("refresh") ?? "";
      this.currentUser.username = sessionStorage.getItem("username") ?? "";
    }
    if (this.token && this.refresh && this.currentUser.username) {
      this.refreshToken().then(() => this.setCurrentUser()).then(() => this.isNotLoggedIn.next(false));
    }
  }

  getHeaders() {
    return new HttpHeaders({
      Authorization: "Bearer " + this.token
    })
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      alert("Error: " + error.error.message);
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private async setCurrentUser() {
    const user = await firstValueFrom(this.http.get<UserDto>(this.url + "users/current/", { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      ));
    this.currentUser = user;
  }

  logout() {
    this.isNotLoggedIn.next(true);
    if (this.interval) { clearInterval(this.interval); }
    this.token = "";
    this.refresh = "";
    this.currentUser = {
      username: "",
      roles: ["guest"]
    }
    if (this.persistance === "local") {
      localStorage.clear();
    } else if (this.persistance === "session") {
      sessionStorage.clear();
    }
    this.http.post(this.url + "auth/reject", { refresh: this.refresh }).pipe(
      catchError(this.handleError)
    );
    this.router.navigate(['home']);
  }

  register(user: UserCredentials) {
    firstValueFrom(this.http.post(this.url + "auth/register/", user).pipe(
      catchError(this.handleError)
    )).then(() => {
      this.router.navigate(['login']);
      alert("Success! You can now log in")
    });
  }

  login(user: UserCredentials) {
    firstValueFrom(this.http.post<Tokens>(this.url + "auth/login/", user).pipe(
      catchError(this.handleError)
    )).then((res) => {
      if (this.persistance === "local") {
        localStorage.setItem("token", res.token.split(" ")[1]);
        localStorage.setItem("refresh", res.refresh);
        localStorage.setItem("username", user.username);
      } else if (this.persistance === "session") {
        sessionStorage.setItem("token", res.token.split(" ")[1]);
        sessionStorage.setItem("refresh", res.refresh);
        sessionStorage.setItem("username", user.username);
      }
      this.token = res.token.split(" ")[1];
      this.refresh = res.refresh;
      this.setCurrentUser().then(() => this.isNotLoggedIn.next(false)).then(() => this.router.navigate(['home']));
    });
  }
}
