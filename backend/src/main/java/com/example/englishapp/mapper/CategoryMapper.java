package com.example.englishapp.mapper;

import com.example.englishapp.dto.CategoryDto;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CategoryMapper {
    /**
     * カテゴリーを一件登録する
     * @param name カテゴリー名
     * @return 登録件数
     */
    int insert(@Param("name") String name);

    /**
     * カテゴリーを登録し、引数のDTOに自動採番されたIDをセットする
     * @param categoryDto 登録するカテゴリー情報
     * @return 登録件数
     */
    int insertWithName(CategoryDto categoryDto);

    /**
     * 全てのカテゴリーを取得する
     * @return カテゴリーのリスト
     */
    List<CategoryDto> findAll();
    
    /**
     * IDでカテゴリーを一件取得する
     * @param id カテゴリーID
     * @return カテゴリー情報
     */
    CategoryDto findById(@Param("id") Long id);

    /**
     * IDで指定されたカテゴリーを更新する
     * @param categoryDto 更新内容を持つDTO
     * @return 更新件数
     */
    int update(CategoryDto categoryDto);

    /**
     * IDで指定されたカテゴリーを削除する
     * @param id 削除するカテゴリーのID
     * @return 削除件数
     */
    int deleteById(@Param("id") Long id);
}