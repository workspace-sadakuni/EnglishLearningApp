package com.example.englishapp.controller;

import com.example.englishapp.dto.CategoryDto;
import com.example.englishapp.dto.request.CategoryCreateRequest;
import com.example.englishapp.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    private static final Logger log = LoggerFactory.getLogger(CategoryController.class);

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        log.info("Fetching all categories.");
        List<CategoryDto> categories = categoryService.findAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryCreateRequest request) {
        log.info("Creating category with name: {}", request.getName());
        CategoryDto createdCategory = categoryService.createCategory(request.getName());
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryCreateRequest request) {

        log.info("Updating category with id: {}, new name: {}", id, request.getName());
        CategoryDto updatedCategory = categoryService.updateCategory(id, request.getName());

        if (updatedCategory == null) {
            // 404返却
            log.info("Updating category with id: {}, not found in CategoryController", id);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        log.info("Deleting category with id: {}", id);
        
        try {
            boolean isDeleted = categoryService.deleteCategory(id);
            if (isDeleted) {
                // 削除成功: 204 No Content
                return ResponseEntity.noContent().build();
            } else {
                // 削除対象なし: 404 Not Found
                log.info("Deleting category with id: {}, not found in CategoryController", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // 例: データベースの制約違反などで削除に失敗した場合
            log.error("An unexpected error occurred while deleting category with id: " + id, e);
            // 実際にはもっと詳細なエラーハンドリングが望ましい
            // 500返却
            return ResponseEntity.internalServerError().build();
        }
    }
}