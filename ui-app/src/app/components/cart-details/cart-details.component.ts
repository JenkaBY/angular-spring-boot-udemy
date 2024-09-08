import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../service/cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0.00;
  totalQuantity: number = 0;


  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.loadCartItems()
  }

  private loadCartItems() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data)
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
    this.cartItems = this.cartService.cartItems

    this.cartService.computeCartTotal();
  }

  incrementQuantity(item: CartItem) {
    this.cartService.addToCart(item)
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item)
  }

  decrementQuantity(item: CartItem) {
    this.cartService.removeFromCart(item)
  }
}
