import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {environment} from "../../environments/environment";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  public getProducts(categoryId: number, page: number, pageSize: number): Observable<GetProducts> {
    let params = new HttpParams()
      .set("categoryId", categoryId);
    if (pageSize) {
      params = params.append("size", pageSize)
    }
    if (page) {
      params = params.append('page', page);
    }
    const url = `${environment.apiUrls.products}products/search/findByCategoryId`;
    return this._searchProducts(url, params);
  }

  private _searchProducts(url: string, params: HttpParams): Observable<GetProducts> {
    return this.http.get<GetProducts>(url,
      {
        params: params,
      });
  }

  public getProductCategories(): Observable<ProductCategory[]> {
    const url = `${environment.apiUrls.products}product-category`;

    return this.http.get<GetProductCategories>(url).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  public search(keyword: string, page?: number, pageSize?: number): Observable<GetProducts> {
    const url = `${environment.apiUrls.products}products/search/findByNameContainingIgnoreCase`;
    let params = new HttpParams()
      .set("name", keyword);
    if (pageSize) {
      params = params.append("size", pageSize)
    }
    if (page) {
      params = params.append('page', page);
    }

    return this._searchProducts(url, params);
  }

  public getProduct(id: number): Observable<Product> {
    const url = `${environment.apiUrls.products}products/${id}`;
    return this.http.get<Product>(url);
  }
}


export interface GetProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}

export interface GetProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
