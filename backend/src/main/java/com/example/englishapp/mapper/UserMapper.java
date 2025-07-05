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
     * ユーザー名でユーザーを検索する
     * @param username ユーザー名
     * @return ユーザー情報
     */
    UserDto findByUsername(@Param("username") String username);

    /**
     * ユーザー名でユーザーを検索するし、パスワードも取得する
     * @param username ユーザー名
     * @return ユーザー情報
     */
    UserDto findByUsernameWithPassword(@Param("username") String username);
}