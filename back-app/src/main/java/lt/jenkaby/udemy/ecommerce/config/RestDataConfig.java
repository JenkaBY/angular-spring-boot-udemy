package lt.jenkaby.udemy.ecommerce.config;

import lt.jenkaby.udemy.ecommerce.entity.Country;
import lt.jenkaby.udemy.ecommerce.entity.Product;
import lt.jenkaby.udemy.ecommerce.entity.ProductCategory;
import lt.jenkaby.udemy.ecommerce.entity.State;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;

@Configuration
public class RestDataConfig implements RepositoryRestConfigurer {

    private final static List<Class<?>> READ_ONLY_ENTITIES = List.of(
            Product.class, ProductCategory.class, Country.class, State.class
    );
    private static final HttpMethod[] UNSUPPORTED_METHODS = {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST};

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        READ_ONLY_ENTITIES.forEach(entity -> {
            config.getExposureConfiguration()
                    .forDomainType(entity)
                    .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(UNSUPPORTED_METHODS)))
                    .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(UNSUPPORTED_METHODS)));
        });

        //        exposeIds
        config.exposeIdsFor(Product.class, ProductCategory.class);
    }
}
