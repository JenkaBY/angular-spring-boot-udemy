package lt.jenkaby.udemy.ecommerce.dto;

import lombok.Data;

@Data
public class PaymentInfo {

    private int amount;
    private String currency;
    private String receiptEmail;
}
