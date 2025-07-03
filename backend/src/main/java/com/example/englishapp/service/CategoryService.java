package com.example.englishapp.service;

import com.example.englishapp.dto.CategoryDto;
import com.example.englishapp.exception.ResourceAlreadyExistsException;
import com.example.englishapp.mapper.CategoryMapper;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryService {

    private final CategoryMapper categoryMapper;

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    public CategoryService(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public CategoryDto createCategory(String name) {
        try {
            // useGeneratedKeysを正しく扱うための方法
            CategoryDto newCategory = new CategoryDto();
            newCategory.setName(name);

            // MapperのネームスペースとIDを直接指定して実行
            categoryMapper.insertWithName(newCategory);

            // useGeneratedKeys="true" keyProperty="id" の設定により、
            // この時点でnewCategoryオブジェクトのidフィールドに値がセットされている
            return newCategory;
        } catch (DataIntegrityViolationException e) {
            // DBエラーを捕捉し、ビジネス的な意味を持つ例外に変換してスローする
            throw new ResourceAlreadyExistsException("Category with name '" + name + "' already exists.");
        }
    }

    public List<CategoryDto> findAllCategories() {
        return categoryMapper.findAll();
    }

    public CategoryDto updateCategory(Long id, String name) {
        try {
            CategoryDto categoryToUpdate = new CategoryDto();
            categoryToUpdate.setId(id);
            categoryToUpdate.setName(name);
            
            int updatedRows = categoryMapper.update(categoryToUpdate);

            if (updatedRows == 0) {
                // 更新対象が見つからなかった場合
                // 本来は専用の例外を投げるのが望ましい
                log.info("Updating category with id: {}, not found in CategoryService", id);
                return null;
            }
            
            return categoryMapper.findById(id);
        } catch (DataIntegrityViolationException e) {
            // DBエラーを捕捉し、ビジネス的な意味を持つ例外に変換してスローする
            throw new ResourceAlreadyExistsException("Category with name '" + name + "' already exists.");
        }
    }

    /**
     * 指定されたIDのカテゴリーを削除する
     * @param id 削除するカテゴリーのID
     * @return 削除が成功した(1件以上削除された)場合は true, 削除対象が見つからなかった場合は false
     */
    public boolean deleteCategory(Long id) {
        // 関連する英単語のcategory_idをnullにする処理（必要であれば実装）: 現状、word側はDB制約によってnullとなる。
        // wordMapper.setCategoryIdToNullByCategoryId(id);
        
        // deleteByIdは削除した行数を返す
        int deletedRows = categoryMapper.deleteById(id);
        
        // 削除件数が1以上であればtrue、0であればfalseを返す
        return deletedRows > 0;
    }
}