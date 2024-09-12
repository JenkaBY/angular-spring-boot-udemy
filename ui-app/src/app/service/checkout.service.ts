import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = `${environment.apiUrls.products}checkout/purchase`;

  constructor(private httpClient: HttpClient) { }

  public placeOrder(purchase: Purchase): Observable<PostPurchase> {

    return this.httpClient.post<PostPurchase>(this.purchaseUrl, purchase);
  }
}

interface PostPurchase {
  orderTrackingNumber: string;
}
