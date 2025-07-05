package com.example.englishapp.mapper;

import com.example.englishapp.dto.LoginHistoryDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginHistoryMapper {
    void insert(LoginHistoryDto loginHistory);
}