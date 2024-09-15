package lt.jenkaby.udemy.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${spring.data.rest.base-path}")
    private String basePath;
    @Value("${management.endpoints.web.cors.allowed-origins}")
    private String[] corsAllowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping(basePath + "/**").allowedOrigins(corsAllowedOrigins);
    }
}
