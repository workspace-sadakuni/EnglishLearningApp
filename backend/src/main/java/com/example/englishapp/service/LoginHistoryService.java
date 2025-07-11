package com.example.englishapp.service;

import com.example.englishapp.dto.LoginHistoryDto;
import com.example.englishapp.dto.UserDto;
import com.example.englishapp.mapper.LoginHistoryMapper;
import com.example.englishapp.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class LoginHistoryService {

    private final LoginHistoryMapper loginHistoryMapper;
    private final UserMapper userMapper;

    public LoginHistoryService(LoginHistoryMapper loginHistoryMapper, UserMapper userMapper) {
        this.loginHistoryMapper = loginHistoryMapper;
        this.userMapper = userMapper;
    }

    public void recordLoginAttempt(String username, String status, HttpServletRequest request) {
        UserDto user = userMapper.findByUsername(username);
        Long userId = (user != null) ? user.getId() : null;

        LoginHistoryDto history = LoginHistoryDto.builder()
                .userId(userId)
                .username(username)
                .ipAddress(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .loginStatus(status)
                .build();
        
        loginHistoryMapper.insert(history);
    }

    public java.util.List<LoginHistoryDto> getLoginHistoryByUserId(Long userId) {
        return loginHistoryMapper.findByUserId(userId);
    }

    public com.example.englishapp.dto.PagedResult<LoginHistoryDto> getLoginHistoryByUserIdWithFilter(Long userId, String status, java.time.LocalDateTime from, java.time.LocalDateTime to, int page, int size) {
        int offset = (page - 1) * size;
        java.util.List<LoginHistoryDto> items = loginHistoryMapper.findByUserIdWithFilter(userId, status, from, to, offset, size);
        long totalItems = loginHistoryMapper.countByUserIdWithFilter(userId, status, from, to);
        int totalPages = (int) Math.ceil((double) totalItems / size);
        return new com.example.englishapp.dto.PagedResult<>(items, totalItems, totalPages, page);
    }

    private String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";
        if (request != null) {
            // X-FORWARDED-FORヘッダーをチェックすることで、リバースプロキシ（Nginxなど）を経由した場合でも、元のクライアントのIPアドレスを取得。
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            }
        }
        return remoteAddr;
    }
}