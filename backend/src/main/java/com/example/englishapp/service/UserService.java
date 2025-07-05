package com.example.englishapp.service;

import com.example.englishapp.dto.UserDto;
import com.example.englishapp.exception.ResourceAlreadyExistsException;
import com.example.englishapp.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto registerUser(String username, String password) {
        // ユーザー名がすでに存在するかチェック
        if (userMapper.findByUsername(username) != null) {
            throw new ResourceAlreadyExistsException("Username '" + username + "' is already taken.");
        }

        // パスワードをハッシュ化
        String hashedPassword = passwordEncoder.encode(password);

        // ユーザーをDBに保存
        userMapper.insert(username, hashedPassword);
        
        // 登録されたユーザー情報を返す（パスワードは含めない）
        return userMapper.findByUsername(username);
    }
}