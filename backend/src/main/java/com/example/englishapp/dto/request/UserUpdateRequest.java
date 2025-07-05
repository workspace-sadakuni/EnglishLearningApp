package com.example.englishapp.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {

    // ユーザー名はオプショナル（空なら変更しない）
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    private String username;

    // パスワードもオプショナル（空なら変更しない）
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters.")
    private String password;
}