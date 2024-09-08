import {Component, OnInit} from '@angular/core';
import {GetProducts, ProductService} from "../../service/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../service/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  //  keyword
  searchMode: boolean = false;
  prevKeyword: string = "";
  //  pagination
  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getProductList();
    })
  }

  getProductList() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    this.productService.getProducts(this.currentCategoryId, this.pageNumber - 1, this.pageSize)
      .subscribe((data) => this.subscribeProductsList(data));
  }

  private handleSearchProducts() {
    const currentKeyword = this.route.snapshot.paramMap.get('keyword')!
    if (this.prevKeyword != currentKeyword) {
      this.pageNumber = 1;
    }
    this.prevKeyword = currentKeyword;
    this.productService.search(currentKeyword, this.pageNumber - 1, this.pageSize)
      .subscribe((data) => this.subscribeProductsList(data));
  }

  private subscribeProductsList(data: GetProducts) {
    this.products = data._embedded.products;
    this.pageNumber = data.page.number + 1;
    this.pageSize = data.page.size;
    this.totalElements = data.page.totalElements;
  }

  updatePageSize(newPageSize: string) {
    this.pageSize = +newPageSize;
    this.pageNumber = 1;
    this.getProductList();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product))
  }
}
