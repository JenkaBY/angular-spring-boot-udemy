import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {from, lastValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next))
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const secEndpoints = ['/api/orders']
    if (secEndpoints.some(url => req.url.includes(url))) {
      const accessToken = this.oktaAuth.getAccessToken();

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
    return await lastValueFrom(next.handle(req));
  }
}
