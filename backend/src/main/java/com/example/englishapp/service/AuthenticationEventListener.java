package com.example.englishapp.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class AuthenticationEventListener {

    private final LoginHistoryService loginHistoryService;

    public AuthenticationEventListener(LoginHistoryService loginHistoryService) {
        this.loginHistoryService = loginHistoryService;
    }

    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        String username = event.getAuthentication().getName();
        HttpServletRequest request = getCurrentHttpRequest();
        loginHistoryService.recordLoginAttempt(username, "SUCCESS", request);
    }

    @EventListener
    public void handleAuthenticationFailure(AbstractAuthenticationFailureEvent event) {
        // ユーザー名が取得できる場合のみ記録
        Object principal = event.getAuthentication().getPrincipal();
        if (principal instanceof String) {
            String username = (String) principal;
            HttpServletRequest request = getCurrentHttpRequest();
            loginHistoryService.recordLoginAttempt(username, "FAILURE", request);
        }
    }

    private HttpServletRequest getCurrentHttpRequest() {
        // イベントリスナーは直接HttpServletRequestを受け取れないため、RequestContextHolderを使って現在のリクエスト情報を取得。
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }
}