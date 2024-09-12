package lt.jenkaby.udemy.ecommerce.dto;

import lombok.Data;
import lt.jenkaby.udemy.ecommerce.entity.Address;
import lt.jenkaby.udemy.ecommerce.entity.Customer;
import lt.jenkaby.udemy.ecommerce.entity.Order;
import lt.jenkaby.udemy.ecommerce.entity.OrderItem;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
