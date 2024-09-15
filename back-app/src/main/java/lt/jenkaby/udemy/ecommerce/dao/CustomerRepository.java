package lt.jenkaby.udemy.ecommerce.dao;

import lt.jenkaby.udemy.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);
}
