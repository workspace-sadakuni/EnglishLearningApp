package com.example.englishapp.mapper;

import com.example.englishapp.dto.CategoryDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

@MybatisTest
@ActiveProfiles("test")
class CategoryMapperTest {

    @Autowired
    private CategoryMapper categoryMapper;

    @Test
    @DisplayName("Mapperでカテゴリーを登録し、IDで取得できること")
    void insertAndFindById() {
        // Given
        CategoryDto newCategory = new CategoryDto();
        newCategory.setName("Mapper Test");

        // When
        categoryMapper.insertWithName(newCategory);
        Long newId = newCategory.getId(); // 自動採番されたIDを取得
        
        CategoryDto foundCategory = categoryMapper.findById(newId);

        // Then
        assertThat(foundCategory).isNotNull();
        assertThat(foundCategory.getName()).isEqualTo("Mapper Test");
    }
}