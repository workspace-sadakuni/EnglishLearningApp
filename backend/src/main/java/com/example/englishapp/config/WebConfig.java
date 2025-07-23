package com.example.englishapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.resource-path}")
    private String resourcePath;

    // ベースとなるアップロードディレクトリを指定 (docker-composeでマウントするパス)
    private final String uploadDir = "/app/uploads/";

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // /files/** というURLへのリクエストを、/app/uploads/ ディレクトリにマッピングする
        // 例: /files/images/foo.jpg -> /app/uploads/images/foo.jpg
        registry.addResourceHandler(resourcePath + "**")
                .addResourceLocations("file:" + uploadDir);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // すべてのパスを対象にする
                .allowedOrigins("*")       // すべてのオリジンからのリクエストを許可
                .allowedMethods("*")      // すべてのHTTPメソッドを許可
                .allowedHeaders("*");      // すべてのヘッダーを許可
    }
}