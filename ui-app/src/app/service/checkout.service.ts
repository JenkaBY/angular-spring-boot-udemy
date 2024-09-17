import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {PaymentInfo} from "../common/payment-info";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = `${environment.apiUrls.products}checkout/purchase`;
  private paymentIntentUrl = `${environment.apiUrls.products}checkout/payment-intents`;

  constructor(private httpClient: HttpClient) { }

  public placeOrder(purchase: Purchase): Observable<PostPurchase> {

    return this.httpClient.post<PostPurchase>(this.purchaseUrl, purchase);
  }

  public createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<any>(this.paymentIntentUrl, paymentInfo);
  }
}

interface PostPurchase {
  orderTrackingNumber: string;
}
