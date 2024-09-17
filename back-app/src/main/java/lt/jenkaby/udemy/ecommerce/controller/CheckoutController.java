package lt.jenkaby.udemy.ecommerce.controller;

import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lt.jenkaby.udemy.ecommerce.dto.PaymentInfo;
import lt.jenkaby.udemy.ecommerce.dto.Purchase;
import lt.jenkaby.udemy.ecommerce.dto.PurchaseResponse;
import lt.jenkaby.udemy.ecommerce.service.CheckoutService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;

    @PostMapping("/purchase")
    public PurchaseResponse checkout(@RequestBody Purchase purchase) {
        log.info("Checkout purchase: {}", purchase);
        return checkoutService.placeOrder(purchase);
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/payment-intents")
    public String paymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {
        log.info("Payment intent: {}", paymentInfo);
        return checkoutService.createPaymentIntent(paymentInfo).toJson();
    }
}
