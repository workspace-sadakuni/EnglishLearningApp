package com.example.englishapp.mapper;

import com.example.englishapp.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    /**
     * ユーザーを登録する
     * @param username ユーザー名
     * @param hashedPassword ハッシュ化されたパスワード
     */
    void insert(@Param("username") String username, @Param("hashedPassword") String hashedPassword);

    /**
     * ユーザーIDでユーザーを検索する
     * @param id ユーザーID
     * @return ユーザー情報
     */
    UserDto findById(@Param("id") Long id);

    /**
     * ユーザー名でユーザーを検索する
     * @param username ユーザー名
     * @return ユーザー情報
     */
    UserDto findByUsername(@Param("username") String username);

    /**
     * ユーザー名でユーザーを検索し、パスワードも取得する
     * @param username ユーザー名
     * @return ユーザー情報
     */
    UserDto findByUsernameWithPassword(@Param("username") String username);

    /**
     * ユーザー情報を更新する
     * @param userDto 更新するユーザー情報
     * @return 更新件数
     */
    int update(UserDto userDto);
    
    /**
     * ユーザーIDでユーザーを削除する
     * @param id ユーザーID
     * @return 削除件数
     */
    int deleteById(@Param("id") Long id);
}