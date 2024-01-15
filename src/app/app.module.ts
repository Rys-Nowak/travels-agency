import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TripsComponent } from './trips/trips.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './cart/cart.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AddformComponent } from './addform/addform.component';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from './rating/rating.component';
import { FilterComponent } from './filter/filter.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FilterPipe } from './filter/filter.pipe';
import { InfoComponent } from './info/info.component';
import { PaginationComponent } from './pagination/pagination.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    TripsComponent,
    CartComponent,
    NavbarComponent,
    HomeComponent,
    AddformComponent,
    RatingComponent,
    FilterComponent,
    FilterPipe,
    InfoComponent,
    PaginationComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [FilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
