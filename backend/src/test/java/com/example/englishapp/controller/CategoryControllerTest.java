package com.example.englishapp.controller;

import com.example.englishapp.dto.CategoryDto;
import com.example.englishapp.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// CategoryControllerをテスト対象として指定
@WebMvcTest(CategoryController.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc; // APIリクエストをシミュレートするためのオブジェクト

    @MockBean // DIコンテナ内のCategoryServiceをモックに置き換える
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper; // JavaオブジェクトをJSONに変換するために使用

    @Test
    @DisplayName("GET /api/categories - 全カテゴリーを正常に取得できること")
    void getAllCategories_success() throws Exception {
        // Given (前提条件)
        CategoryDto cat1 = new CategoryDto();
        cat1.setId(1L);
        cat1.setName("Daily Life");
        List<CategoryDto> categories = List.of(cat1);

        // Serviceが返すダミーデータを設定
        when(categoryService.findAllCategories()).thenReturn(categories);

        // When (APIリクエストの実行)
        ResultActions result = mockMvc.perform(get("/api/categories"));

        // Then (結果の検証)
        result.andExpect(status().isOk()) // HTTPステータスが200 OKであること
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(jsonPath("$.size()", is(1))) // レスポンスのJSON配列のサイズが1であること
              .andExpect(jsonPath("$[0].name", is("Daily Life"))); // 0番目の要素のnameが"Daily Life"であること
    }
    
    @Test
    @DisplayName("POST /api/categories - 新しいカテゴリーを正常に登録できること")
    void createCategory_success() throws Exception {
        // Given
        CategoryDto createdCategory = new CategoryDto();
        createdCategory.setId(1L);
        createdCategory.setName("Travel");

        // Serviceが返すダミーデータを設定
        when(categoryService.createCategory(anyString())).thenReturn(createdCategory);
        
        // リクエストボディとして送信するJSONを作成
        String requestBody = objectMapper.writeValueAsString(createdCategory);

        // When
        ResultActions result = mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));

        // Then
        result.andExpect(status().isCreated()) // HTTPステータスが201 Createdであること
              .andExpect(jsonPath("$.id", is(1)))
              .andExpect(jsonPath("$.name", is("Travel")));
    }
    
    @Test
    @DisplayName("PUT /api/categories/{id} - 既存のカテゴリーを正常に編集できること")
    void updateCategory_success() throws Exception {
        // Given
        Long categoryId = 1L;
        String newName = "Updated Name";
        
        CategoryDto updatedCategory = new CategoryDto();
        updatedCategory.setId(categoryId);
        updatedCategory.setName(newName);
        
        when(categoryService.updateCategory(anyLong(), anyString())).thenReturn(updatedCategory);

        String requestBody = objectMapper.writeValueAsString(updatedCategory);

        // When
        ResultActions result = mockMvc.perform(put("/api/categories/{id}", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));

        // Then
        result.andExpect(status().isOk())
              .andExpect(jsonPath("$.name", is(newName)));
    }

    @Test
    @DisplayName("PUT /api/categories/{id} - 存在しないIDで編集しようとすると404エラーが返されること")
    void updateCategory_not_found() throws Exception {
        // Given (前提条件)
        Long nonExistentId = 999L;
        String requestJson = "{\"name\":\"Non Existent\"}";

        // Serviceがnullを返すようにモックを設定
        // when(categoryService.updateCategory(...)).thenReturn(null); と同じ意味
        given(categoryService.updateCategory(anyLong(), anyString())).willReturn(null);

        // When (APIリクエストの実行)
        ResultActions result = mockMvc.perform(put("/api/categories/{id}", nonExistentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson));

        // Then (結果の検証)
        result.andExpect(status().isNotFound()); // HTTPステータスが404 Not Foundであること
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} - 既存のカテゴリーを正常に削除できること (204 No Content)")
    void deleteCategory_success() throws Exception {
        // Given
        Long categoryId = 1L;
        // Serviceがtrueを返すようにモックを設定
        when(categoryService.deleteCategory(categoryId)).thenReturn(true);

        // When
        ResultActions result = mockMvc.perform(delete("/api/categories/{id}", categoryId));

        // Then
        result.andExpect(status().isNoContent()); // 204 No Contentであることを検証
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} - 存在しないIDで削除しようとすると404エラーが返されること")
    void deleteCategory_not_found() throws Exception {
        // Given
        Long nonExistentId = 999L;
        // Serviceがfalseを返すようにモックを設定
        when(categoryService.deleteCategory(nonExistentId)).thenReturn(false);

        // When
        ResultActions result = mockMvc.perform(delete("/api/categories/{id}", nonExistentId));

        // Then
        result.andExpect(status().isNotFound()); // 404 Not Foundであることを検証
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} - 削除処理中に例外が発生すると500エラーが返されること")
    void deleteCategory_throws_exception() throws Exception {
        // Given
        Long categoryId = 1L;

        // ServiceのdeleteCategoryが呼ばれたら、RuntimeExceptionをスローするようにモックを設定
        doThrow(new RuntimeException("Database error")).when(categoryService).deleteCategory(categoryId);

        // When
        ResultActions result = mockMvc.perform(delete("/api/categories/{id}", categoryId));

        // Then
        result.andExpect(status().isInternalServerError()); // HTTPステータスが500 Internal Server Errorであること
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} - Serviceで例外が発生した場合 (500 Internal Server Error)")
    void deleteCategory_throws_exception2() throws Exception {
        // Given
        Long categoryId = 1L;
        // DataAccessExceptionはDBエラーの典型的な例外
        when(categoryService.deleteCategory(categoryId)).thenThrow(new DataAccessException("DB connection failed") {});

        // When & Then
        mockMvc.perform(delete("/api/categories/{id}", categoryId))
               .andExpect(status().isInternalServerError());
    }
}