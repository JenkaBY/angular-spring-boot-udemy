package lt.jenkaby.udemy.ecommerce.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lt.jenkaby.udemy.ecommerce.dto.PaymentInfo;
import lt.jenkaby.udemy.ecommerce.dto.Purchase;
import lt.jenkaby.udemy.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
