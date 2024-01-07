import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  convertPln(value: number, currency: string) {
    switch (currency) {
      case 'PLN':
        return value;
      case 'GBP':
        return this.convertPlnToGbp(value);
      case 'EUR':
        return this.convertPlnToEur(value);
      case 'USD':
        return this.convertPlnToUsd(value);
      default:
        throw new Error("Invalid currency");
    }
  }

  convertPlnToGbp(value: number) {
    return value * 0.2;
  }

  convertPlnToUsd(value: number) {
    return value * 0.25;
  }

  convertPlnToEur(value: number) {
    return value * 0.23;
  }
}
