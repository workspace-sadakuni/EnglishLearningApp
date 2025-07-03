package com.example.englishapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.resource-path}")
    private String resourcePath;

    // ベースとなるアップロードディレクトリを指定 (docker-composeでマウントするパス)
    private final String uploadDir = "/app/uploads/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /files/** というURLへのリクエストを、/app/uploads/ ディレクトリにマッピングする
        // 例: /files/images/foo.jpg -> /app/uploads/images/foo.jpg
        registry.addResourceHandler(resourcePath + "**")
                .addResourceLocations("file:" + uploadDir);
    }
}