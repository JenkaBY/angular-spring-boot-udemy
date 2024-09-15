package lt.jenkaby.udemy.ecommerce.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lt.jenkaby.udemy.ecommerce.dto.Purchase;
import lt.jenkaby.udemy.ecommerce.dto.PurchaseResponse;
import lt.jenkaby.udemy.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
