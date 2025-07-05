package com.example.englishapp.service;

import com.example.englishapp.mapper.UserMapper;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    public CustomUserDetailsService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.example.englishapp.dto.UserDto userDto = userMapper.findByUsernameWithPassword(username);

        if (userDto == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        return new User(userDto.getUsername(), userDto.getPassword(), Collections.emptyList());
    }
}