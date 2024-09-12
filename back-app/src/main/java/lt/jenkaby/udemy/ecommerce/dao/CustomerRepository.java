package lt.jenkaby.udemy.ecommerce.dao;

import lt.jenkaby.udemy.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
