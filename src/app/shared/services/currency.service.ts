import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencyCounter: number = 0;
  currency: string = "PLN";
  currencies: string[] = ['PLN', 'USD', 'EUR', 'GBP'];

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

  convertCurrency(value: number) {
    return this.convertPln(value, this.currencies[this.currencyCounter])
  }

  switchCurrency() {
    ++this.currencyCounter;
    this.currencyCounter %= 4;
    this.currency = this.currencies[this.currencyCounter];
  }
}
