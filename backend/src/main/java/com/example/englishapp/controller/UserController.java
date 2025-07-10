package com.example.englishapp.controller;

import com.example.englishapp.dto.UserDto;
import com.example.englishapp.dto.request.AuthenticationRequest;
import com.example.englishapp.dto.request.UserRegistrationRequest;
import com.example.englishapp.dto.request.UserUpdateRequest;
import com.example.englishapp.service.LoginHistoryService;
import com.example.englishapp.service.UserService;
import com.example.englishapp.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final LoginHistoryService loginHistoryService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil, LoginHistoryService loginHistoryService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.loginHistoryService = loginHistoryService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserDto newUser = userService.registerUser(request.getUsername(), request.getPassword());
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        // ユーザー名とパスワードで認証を実行
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
        );

        // 認証が成功したら、UserDetailsを取得
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        
        // JWTを生成
        final String jwt = jwtUtil.generateToken(userDetails);

        // JWTをレスポンスとして返す
        return ResponseEntity.ok(Map.of("token", jwt));
    }

    // --- プロフィール取得APIを追加 ---
    // @AuthenticationPrincipal UserDetails userDetails: このアノテーションを使うと、Spring Securityが現在認証中のユーザーの情報（この場合はUserDetailsオブジェクト）を引数に自動的にインジェクトしてくれます。
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto user = userService.findByUsername(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/login-history")
    public ResponseEntity<com.example.englishapp.dto.PagedResult<com.example.englishapp.dto.LoginHistoryDto>> getMyLoginHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        com.example.englishapp.dto.UserDto user = userService.findByUsername(userDetails.getUsername());
        
        // fromおよびtoについて、JSTとなっているためDB検索用にUTC時刻に変換
        java.time.LocalDateTime fromDate = (from != null && !from.isEmpty())
            ? java.time.LocalDateTime.parse(from).atZone(ZoneId.of("Asia/Tokyo")).withZoneSameInstant(ZoneId.of("UTC")).toLocalDateTime()
            : null;
        java.time.LocalDateTime toDate = (to != null && !to.isEmpty())
            ? java.time.LocalDateTime.parse(to).atZone(ZoneId.of("Asia/Tokyo")).withZoneSameInstant(ZoneId.of("UTC")).toLocalDateTime()
            : null;
        com.example.englishapp.dto.PagedResult<com.example.englishapp.dto.LoginHistoryDto> result = loginHistoryService.getLoginHistoryByUserIdWithFilter(user.getId(), status, fromDate, toDate, page, size);
        return ResponseEntity.ok(result);
    }

    // --- アカウント更新APIを追加 ---
    // @AuthenticationPrincipal UserDetails userDetails: このアノテーションを使うと、Spring Securityが現在認証中のユーザーの情報（この場合はUserDetailsオブジェクト）を引数に自動的にインジェクトしてくれます。
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        // 現在ログイン中のユーザー情報を取得
        UserDto currentUser = userService.findByUsername(userDetails.getUsername());
        
        // Serviceはパスワード付きのDTOを返すように修正した
        UserDto updatedUserWithPassword = userService.updateUser(currentUser.getId(), request.getUsername(), request.getPassword());
        
        // UserDetailsを構築
        UserDetails newDetails = org.springframework.security.core.userdetails.User
                .withUsername(updatedUserWithPassword.getUsername())
                .password(updatedUserWithPassword.getPassword()) // これでnullにならない
                .authorities(Collections.emptyList())
                .build();
        
        // 新しいJWTを生成
        String newJwt = jwtUtil.generateToken(newDetails);

        // レスポンス用に、パスワードを含まないDTOを準備
        UserDto responseUser = new UserDto();
        responseUser.setId(updatedUserWithPassword.getId());
        responseUser.setUsername(updatedUserWithPassword.getUsername());
        responseUser.setCreatedAt(updatedUserWithPassword.getCreatedAt());
        responseUser.setUpdatedAt(updatedUserWithPassword.getUpdatedAt());

        // 更新後のユーザー情報と新しいトークンを一緒に返す
        Map<String, Object> response = new HashMap<>();
        response.put("user", responseUser);
        response.put("token", newJwt);
        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto currentUser = userService.findByUsername(userDetails.getUsername());
        boolean deleted = userService.deleteUser(currentUser.getId());
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user account.");
        }
    }
}