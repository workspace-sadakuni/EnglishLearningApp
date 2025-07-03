package com.example.englishapp.mapper;

import com.example.englishapp.dto.WordDto;
import com.example.englishapp.dto.WordWithCategoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface WordMapper {
    void insert(WordDto wordDto);

    List<WordWithCategoryDto> findAll(@Param("searchTerm") String searchTerm, @Param("offset") int offset, @Param("limit") int limit);
    // 総件数をカウントするメソッドを追加(ページング表示用)
    long countAll(@Param("searchTerm") String searchTerm);

    WordWithCategoryDto findById(@Param("id") Long id);

    int update(WordDto wordDto);

    int deleteById(@Param("id") Long id);

    /**
     * 指定されたカテゴリーIDに紐づく単語のリストを取得する
     * @param categoryId カテゴリーID
     * @return 単語のリスト
     */
    List<WordDto> findByCategoryId(@Param("categoryId") Long categoryId);
}