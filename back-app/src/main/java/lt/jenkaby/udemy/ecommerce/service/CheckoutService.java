package lt.jenkaby.udemy.ecommerce.service;

import lt.jenkaby.udemy.ecommerce.dto.Purchase;
import lt.jenkaby.udemy.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
