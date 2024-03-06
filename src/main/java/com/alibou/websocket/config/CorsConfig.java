package com.alibou.websocket.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ws/**")  // Cambia "/ws/**" al patrón que coincida con tus endpoints de WebSocket
                .allowedOrigins("http://localhost:4200") // Cambia "http://localhost:4200" al origen de tu aplicación Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}