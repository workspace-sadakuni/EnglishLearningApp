package com.example.englishapp.mapper;

import com.example.englishapp.dto.LoginHistoryDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginHistoryMapper {
    void insert(LoginHistoryDto loginHistory);

    /**
     * 指定ユーザーのログイン履歴一覧を取得
     * @param userId ユーザーID
     * @return ログイン履歴リスト
     */
    java.util.List<com.example.englishapp.dto.LoginHistoryDto> findByUserId(Long userId);

    /**
     * 指定ユーザーのログイン履歴一覧をページネーション・フィルタ付きで取得
     */
    java.util.List<com.example.englishapp.dto.LoginHistoryDto> findByUserIdWithFilter(Long userId, String status, java.time.LocalDateTime from, java.time.LocalDateTime to, int offset, int limit);

    /**
     * 指定ユーザーのログイン履歴の件数（フィルタ付き）
     */
    long countByUserIdWithFilter(Long userId, String status, java.time.LocalDateTime from, java.time.LocalDateTime to);
}