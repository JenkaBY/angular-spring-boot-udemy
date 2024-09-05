package lt.jenkaby.udemy.ecommerce.dao;

import lt.jenkaby.udemy.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
