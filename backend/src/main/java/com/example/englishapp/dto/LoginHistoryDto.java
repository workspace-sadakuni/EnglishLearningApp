package com.example.englishapp.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder // Builderパターンを使うとオブジェクト生成が楽になる
public class LoginHistoryDto {
    private Long id;
    private Long userId;
    private String username;
    private String ipAddress;
    private String userAgent;
    private String loginStatus;
    private LocalDateTime loginAt;
}