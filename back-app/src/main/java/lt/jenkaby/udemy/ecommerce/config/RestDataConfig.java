package lt.jenkaby.udemy.ecommerce.config;

import lt.jenkaby.udemy.ecommerce.entity.Product;
import lt.jenkaby.udemy.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestDataConfig implements RepositoryRestConfigurer {


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST};

        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)));

    }
}
