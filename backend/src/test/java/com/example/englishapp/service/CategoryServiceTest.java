package com.example.englishapp.service;

import com.example.englishapp.dto.CategoryDto;
import com.example.englishapp.mapper.CategoryMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

// Springコンテキストを一切起動しない、純粋なMockitoテスト
@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock // Mapperをモック(偽物)にする
    private CategoryMapper categoryMapper;

    @InjectMocks // モックを注入してServiceのインスタンスを生成
    private CategoryService categoryService;

    @Test
    @DisplayName("新しいカテゴリーを正常に登録できること")
    void createCategory_success() {
        // Given (前提条件)
        String categoryName = "Travel";
        
        // MapperのinsertWithNameが呼ばれた際の動きを定義
        when(categoryMapper.insertWithName(any(CategoryDto.class))).thenAnswer(invocation -> {
            CategoryDto dto = invocation.getArgument(0);
            dto.setId(1L); // ダミーのIDをセット
            return 1; // insertの戻り値（登録件数）
        });

        // When (テスト対象のメソッド実行)
        CategoryDto result = categoryService.createCategory(categoryName);

        // Then (結果の検証)
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo(categoryName);
        
        // MapperのinsertWithNameメソッドが1回呼ばれたことを確認
        verify(categoryMapper, times(1)).insertWithName(any(CategoryDto.class));
    }

    // --- ここからテストケースを追加 ---

    @Test
    @DisplayName("登録済みの全カテゴリーをリストで取得できること")
    void findAllCategories_should_return_list() {
        // Given
        CategoryDto cat1 = new CategoryDto();
        cat1.setId(1L);
        cat1.setName("Daily Life");
        
        CategoryDto cat2 = new CategoryDto();
        cat2.setId(2L);
        cat2.setName("Business");

        // categoryMapper.findAll()が呼ばれたら、準備したリストを返すように定義
        when(categoryMapper.findAll()).thenReturn(List.of(cat1, cat2));

        // When
        List<CategoryDto> result = categoryService.findAllCategories();

        // Then
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);
        assertThat(result).extracting(CategoryDto::getName)
                .containsExactly("Daily Life", "Business");
        
        verify(categoryMapper, times(1)).findAll();
    }

    @Test
    @DisplayName("カテゴリーが一件も登録されていない場合、空のリストが返されること")
    void findAllCategories_no_categories_should_return_empty_list() {
        // Given
        // categoryMapper.findAll()が呼ばれたら、空のリストを返すように定義
        when(categoryMapper.findAll()).thenReturn(Collections.emptyList());

        // When
        List<CategoryDto> result = categoryService.findAllCategories();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();

        verify(categoryMapper, times(1)).findAll();
    }
    
    @Test
    @DisplayName("既存のカテゴリーを正常に編集できること")
    void updateCategory_success() {
        // Given
        Long categoryId = 1L;
        String newName = "Updated Name";
        
        CategoryDto updatedDtoInDb = new CategoryDto();
        updatedDtoInDb.setId(categoryId);
        updatedDtoInDb.setName(newName);

        // categoryMapper.update()が呼ばれたら、1（更新件数）を返すように定義
        when(categoryMapper.update(any(CategoryDto.class))).thenReturn(1);
        // categoryMapper.findById()が呼ばれたら、更新後のDTOを返すように定義
        when(categoryMapper.findById(categoryId)).thenReturn(updatedDtoInDb);

        // When
        CategoryDto result = categoryService.updateCategory(categoryId, newName);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(categoryId);
        assertThat(result.getName()).isEqualTo(newName);

        verify(categoryMapper, times(1)).update(any(CategoryDto.class));
        verify(categoryMapper, times(1)).findById(categoryId);
    }
    
    @Test
    @DisplayName("存在しないIDのカテゴリーを編集しようとした場合、nullが返されること")
    void updateCategory_non_existent_id_should_return_null() {
        // Given
        Long nonExistentId = 999L;
        String newName = "New Name";

        // categoryMapper.update()が呼ばれたら、0（更新件数）を返すように定義
        when(categoryMapper.update(any(CategoryDto.class))).thenReturn(0);

        // When
        CategoryDto result = categoryService.updateCategory(nonExistentId, newName);

        // Then
        assertThat(result).isNull();

        verify(categoryMapper, times(1)).update(any(CategoryDto.class));
        // findByIdは呼ばれないはずなので、確認しない（またはverify(..., never())で確認）
        verify(categoryMapper, never()).findById(anyLong());
    }

    @Test
    @DisplayName("既存のカテゴリーを正常に削除できること")
    void deleteCategory_success() {
        // Given
        Long categoryId = 1L;

        // categoryMapper.deleteById()が呼ばれたら、1（削除件数）を返すように定義
        when(categoryMapper.deleteById(categoryId)).thenReturn(1);

        // When
        categoryService.deleteCategory(categoryId);

        // Then
        // categoryMapper.deleteById()が、指定したIDで1回呼ばれたことを確認
        verify(categoryMapper, times(1)).deleteById(categoryId);
    }
}