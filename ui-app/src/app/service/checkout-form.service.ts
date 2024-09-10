import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Country} from "../common/country";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {
  private countriesUrl = `${environment.apiUrls.products}countries`;
  private statesUrl = `${environment.apiUrls.products}states/search/findByCountryCode`;

  constructor(private http: HttpClient) {
  }

  getCreditCardYears(): Observable<number[]> {
    const data: number[] = [];
    let currentYear = new Date().getFullYear();
    let endYear = currentYear + 10;
    for (let year = currentYear; year <= endYear; year++) {
      data.push(year)
    }
    return of(data);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    const data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push(month)
    }
    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(data => data._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const httpParams = new HttpParams().set('code', countryCode);
    return this.http.get<GetResponseStates>(this.statesUrl, {
      params: httpParams,
    }).pipe(
      map(data => data._embedded.states)
    );
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[]
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[]
  }
}
