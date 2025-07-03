package com.example.englishapp.controller;

import com.example.englishapp.dto.WordDto;
import com.example.englishapp.dto.WordWithCategoryDto;
import com.example.englishapp.dto.PagedResult;
import com.example.englishapp.service.WordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class WordController {

    private static final Logger log = LoggerFactory.getLogger(WordController.class);
    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @PostMapping(value = "/words", consumes = {"multipart/form-data"})
    public ResponseEntity<Void> createWord(
            @RequestParam("word") String word,
            @RequestParam("meaning") String meaning,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "audio", required = false) MultipartFile audio
    ) {
        log.info("Creating new word: {}", word);
        try {
            wordService.createWord(word, meaning, categoryId, image, audio);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (IOException e) {
            log.error("Failed to create word", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/words/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Void> updateWord(
            @PathVariable Long id,
            @RequestParam("word") String word,
            @RequestParam("meaning") String meaning,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "audio", required = false) MultipartFile audio
    ) {
        log.info("Updating word with id: {}", id);
        try {
            wordService.updateWord(id, word, meaning, categoryId, image, audio);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            log.error("Failed to update word", e);
            return ResponseEntity.internalServerError().build();
        } catch (RuntimeException e) {
            log.error("Word not found during update", e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/words/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        log.info("Deleting word with id: {}", id);
        try {
            wordService.deleteWord(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IOException e) {
            log.error("Failed to delete word files for id: " + id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/words")
    public ResponseEntity<PagedResult<WordWithCategoryDto>> getAllWords(
            @RequestParam(value = "searchTerm", required = false) String searchTerm,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        log.info("Fetching words. searchTerm: {}, page: {}, size: {}", searchTerm, page, size);
        PagedResult<WordWithCategoryDto> pagedResult = wordService.findAllWords(searchTerm, page, size);
        return ResponseEntity.ok(pagedResult);
    }

    @GetMapping("/words/{id}")
    public ResponseEntity<WordWithCategoryDto> getWordById(@PathVariable Long id) {
        log.info("Fetching word with id: {}", id);
        WordWithCategoryDto word = wordService.findWordById(id);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(word);
    }

    @GetMapping("/categories/{categoryId}/words")
    public ResponseEntity<List<WordDto>> getWordsByCategoryId(@PathVariable Long categoryId) {
        log.info("Fetching words for category id: {}", categoryId);
        List<WordDto> words = wordService.findWordsByCategoryId(categoryId);
        return ResponseEntity.ok(words);
    }
}