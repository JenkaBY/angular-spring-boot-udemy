import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../service/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    console.log("Initit");
    this.getProduct()
  }

  getProduct() {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      this.productService.getProduct(id).subscribe(
        data => this.product = data
      )
    });
  }
}
