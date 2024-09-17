package lt.jenkaby.udemy.ecommerce.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lt.jenkaby.udemy.ecommerce.dao.CustomerRepository;
import lt.jenkaby.udemy.ecommerce.dto.PaymentInfo;
import lt.jenkaby.udemy.ecommerce.dto.Purchase;
import lt.jenkaby.udemy.ecommerce.dto.PurchaseResponse;
import lt.jenkaby.udemy.ecommerce.entity.Customer;
import lt.jenkaby.udemy.ecommerce.entity.Order;
import lt.jenkaby.udemy.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private final CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${payment.stripe.secret}") String stripeSecret) {
        this.customerRepository = customerRepository;
        Stripe.apiKey = stripeSecret;
    }


    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        order.setOrderItems(orderItems);
        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = Optional.of(purchase.getCustomer())
                .flatMap(req -> customerRepository.findByEmail(req.getEmail()))
                .orElse(purchase.getCustomer());

        customer.add(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        var paymentMethodTypes = List.of("card");

        var intentRequest = Map.of(
                "amount", paymentInfo.getAmount(),
                "currency", paymentInfo.getCurrency(),
                "payment_method_types", paymentMethodTypes,
                "description", "Sent from java SB-angular-udemy",
                "receipt_email", paymentInfo.getReceiptEmail());
        return PaymentIntent.create(intentRequest);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
