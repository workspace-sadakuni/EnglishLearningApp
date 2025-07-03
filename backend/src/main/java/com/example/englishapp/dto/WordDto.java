package com.example.englishapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WordDto {
    private Long id;
    private String word;
    private String meaning;
    private Long categoryId;
    private String imagePath;
    private String audioPath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}