package com.example.englishapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // "applocation-test.properties"プロファイルを有効にする
class EnglishAppApplicationTests {

	@Test
	void contextLoads() {
	}

}
