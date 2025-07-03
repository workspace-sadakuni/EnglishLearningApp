package com.example.englishapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedResult<T> {
    private List<T> items;        // 現在のページのアイテムリスト
    private long totalItems;      // 総アイテム数
    private int totalPages;       // 総ページ数
    private int currentPage;      // 現在のページ番号
}