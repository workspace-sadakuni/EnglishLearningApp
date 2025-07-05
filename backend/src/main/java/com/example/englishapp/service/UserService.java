package com.example.englishapp.service;

import com.example.englishapp.dto.UserDto;
import com.example.englishapp.exception.ResourceAlreadyExistsException;
import com.example.englishapp.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
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

    public UserDto updateUser(Long userId, String newUsername, String newPassword) {
        // 更新対象のユーザーが存在するか確認 (今回はfindByIdがないので、findByUsernameで代用)
        // 本来はIDで検索するメソッドがあると良い
        
        UserDto userToUpdate = new UserDto();
        userToUpdate.setId(userId);

        // 新しいユーザー名が指定され、かつ既存のユーザー名と異なる場合
        if (newUsername != null && !newUsername.isEmpty()) {
            // 新しいユーザー名がすでに使われていないかチェック
            UserDto existingUser = userMapper.findByUsername(newUsername);
            if (existingUser != null && !existingUser.getId().equals(userId)) {
                throw new ResourceAlreadyExistsException("Username '" + newUsername + "' is already taken.");
            }
            userToUpdate.setUsername(newUsername);
        }

        // 新しいパスワードが指定された場合
        if (newPassword != null && !newPassword.isEmpty()) {
            userToUpdate.setPassword(passwordEncoder.encode(newPassword));
        }

        userMapper.update(userToUpdate);

        String finalUsername;
        if (newUsername != null && !newUsername.isEmpty()) {
            finalUsername = newUsername;
        } else {
            // IDでユーザーを検索し、現在のユーザー名を取得する
            UserDto currentUser = userMapper.findById(userId);
            finalUsername = currentUser.getUsername();
        }
        
        // 更新後のユーザー情報を、パスワード付きで取得して返す
        return userMapper.findByUsernameWithPassword(finalUsername);
    }

    public UserDto findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public UserDto findByUsernameWithPassword(String username) {
        return userMapper.findByUsernameWithPassword(username);
    }
}