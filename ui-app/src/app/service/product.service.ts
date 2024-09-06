import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  public getProducts(): Observable<Product[]> {
    return this.http.get<GetProducts>(environment.apiUrls.products + "products")
      .pipe(
        map((response: GetProducts) => {
          return response._embedded.products
        })
      );
  }
}


export interface GetProducts {
  _embedded: {
    products: Product[];
  };
}
