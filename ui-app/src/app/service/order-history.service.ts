import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderHistory} from "../common/order-history";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private url = environment.apiUrls.products + 'orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string, page?: number, pageSize?: number): Observable<GetResponseOrderHistory> {
    let params = new HttpParams()
        .set("email", email);
    if (pageSize) {
      params = params.append("size", pageSize)
    }
    if (page) {
      params = params.append('page', page);
    }
    const url = `${this.url}/search/findByCustomerEmailOrderByDateCreatedDesc`;
    return this.httpClient.get<GetResponseOrderHistory>(url, {
      params: params,
    })
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
