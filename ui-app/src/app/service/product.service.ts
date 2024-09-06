import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  public getProducts(categoryId: number): Observable<Product[]> {
    const params = new HttpParams()
      .set("categoryId", categoryId)
      .append("size", 2)
      .append('page', 0);
    const url = `${environment.apiUrls.products}products/search/findByCategoryId`;
    return this.http.get<GetProducts>(url,
      {
        params: params,
      })
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
