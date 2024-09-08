import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }

  addToCart(item: CartItem) {
    const existingIndex = this.cartItems.findIndex(i => i.id === item.id);
    if (existingIndex === -1) {
      this.cartItems.push(item);
    } else {
      this.cartItems[existingIndex].quantity++;
    }
    this.computeCartTotal();
  }

  removeFromCart(item: CartItem) {
    const existingIndex = this.cartItems.findIndex(i => i.id === item.id);
    if (existingIndex === -1) {
      return
    }

    this.cartItems.splice(existingIndex, 1);

    this.computeCartTotal()
  }

  decrementQuantity(item: CartItem) {
    item.quantity--;
    if (item.quantity === 0) {
      this.removeFromCart(item)
      return
    }
    this.computeCartTotal()
  }

  computeCartTotal() {
    const cartTotalPrice = this.cartItems.map(i => i.unitPrice * i.quantity).reduce((prev, curr, _) => {
      return prev + curr;
    }, 0)
    const cartTotalQuantity = this.cartItems.map(i => i.quantity).reduce((prev, curr, _) => {
      return prev + curr;
    }, 0)

    this.totalPrice.next(cartTotalPrice);
    this.totalQuantity.next(cartTotalQuantity);
  }
}
