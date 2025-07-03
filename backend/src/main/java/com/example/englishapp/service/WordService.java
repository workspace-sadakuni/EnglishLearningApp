package com.example.englishapp.service;

import com.example.englishapp.dto.WordDto;
import com.example.englishapp.dto.WordWithCategoryDto;
import com.example.englishapp.dto.PagedResult;
import com.example.englishapp.mapper.WordMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class WordService {

    private final WordMapper wordMapper;
    private final Path imageRootLocation; // 画像保存先のパス
    private final Path audioRootLocation; // 音声保存先のパス
    private static final Logger log = LoggerFactory.getLogger(WordService.class);

    public WordService(
        WordMapper wordMapper,
        @Value("${file.upload-dir.images}") String imageUploadDir,
        @Value("${file.upload-dir.audios}") String audioUploadDir
    ) {
        this.wordMapper = wordMapper;
        this.imageRootLocation = Paths.get(imageUploadDir);
        this.audioRootLocation = Paths.get(audioUploadDir);
        
        try {
            // 起動時にアップロード用ディレクトリがなければ作成
            Files.createDirectories(imageRootLocation);
            Files.createDirectories(audioRootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directories", e);
        }
    }

    public void createWord(String word, String meaning, Long categoryId, MultipartFile imageFile, MultipartFile audioFile) throws IOException {
        // storeFileメソッドを呼び出し、保存先のパスとファイル種別（ディレクトリ名）を渡す
        String imagePath = storeFile(imageFile, imageRootLocation, "images");
        String audioPath = storeFile(audioFile, audioRootLocation, "audios");

        WordDto wordDto = new WordDto();
        wordDto.setWord(word);
        wordDto.setMeaning(meaning);
        wordDto.setCategoryId(categoryId);
        wordDto.setImagePath(imagePath);
        wordDto.setAudioPath(audioPath);

        wordMapper.insert(wordDto);
    }

    public void updateWord(Long id, String word, String meaning, Long categoryId, MultipartFile imageFile, MultipartFile audioFile) throws IOException {
        // 更新前のword情報を取得
        WordWithCategoryDto currentWord = wordMapper.findById(id);
        if (currentWord == null) {
            throw new RuntimeException("Word not found with id: " + id); // or custom exception
        }

        WordDto wordToUpdate = new WordDto();
        wordToUpdate.setId(id);
        wordToUpdate.setWord(word);
        wordToUpdate.setMeaning(meaning);
        wordToUpdate.setCategoryId(categoryId);
        
        // 画像が新しくアップロードされた場合
        if (imageFile != null && !imageFile.isEmpty()) {
            // 古いファイルを削除
            deleteFile(currentWord.getImagePath());
            // 新しいファイルを保存
            String newImagePath = storeFile(imageFile, imageRootLocation, "images");
            wordToUpdate.setImagePath(newImagePath);
        }

        // 音声が新しくアップロードされた場合
        if (audioFile != null && !audioFile.isEmpty()) {
            deleteFile(currentWord.getAudioPath());
            String newAudioPath = storeFile(audioFile, audioRootLocation, "audios");
            wordToUpdate.setAudioPath(newAudioPath);
        }

        wordMapper.update(wordToUpdate);
    }

    public void deleteWord(Long id) throws IOException {
        // 削除対象のword情報を取得して、ファイルパスを得る
        WordWithCategoryDto wordToDelete = wordMapper.findById(id);
        if (wordToDelete == null) {
            // すでに存在しない場合は何もしない、または例外を投げる
            log.warn("Attempted to delete non-existent word with id: {}", id);
            return;
        }

        // 関連ファイルをディスクから削除
        deleteFile(wordToDelete.getImagePath());
        deleteFile(wordToDelete.getAudioPath());

        // DBのレコードを削除
        wordMapper.deleteById(id);
    }

    // ファイル削除用のプライベートメソッドを追加
    private void deleteFile(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }
        // ベースディレクトリからの相対パスを解決して削除
        Path fileToDelete = Paths.get("uploads").resolve(filePath);
        Files.deleteIfExists(fileToDelete);
    }

    /**
     * ファイルを保存し、DBに保存するための相対パスを返す
     * @param file アップロードされたファイル
     * @param location 保存先のルートディレクトリ
     * @param subDir サブディレクトリ名 (e.g., "images", "audios")
     * @return DBに保存するパス (e.g., "images/filename.jpg")
     * @throws IOException ファイル保存時のエラー
     */
    private String storeFile(MultipartFile file, Path location, String subDir) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // ファイル名が重複しないようにUUIDを付与
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // ファイルを保存
        Files.copy(file.getInputStream(), location.resolve(filename));

        // DBにはサブディレクトリ名を含んだパスを保存する
        return subDir + "/" + filename;
    }

    public PagedResult<WordWithCategoryDto> findAllWords(String searchTerm, int page, int size) {
        // offsetの計算 (pageは1始まりと仮定)
        int offset = (page - 1) * size;
        
        // ページングされたデータリストを取得
        List<WordWithCategoryDto> items = wordMapper.findAll(searchTerm, offset, size);
        
        // 検索条件に一致する総アイテム数を取得
        long totalItems = wordMapper.countAll(searchTerm);
        
        // 総ページ数を計算
        int totalPages = (int) Math.ceil((double) totalItems / size);
        
        // PagedResultオブジェクトに詰めて返す
        return new PagedResult<>(items, totalItems, totalPages, page);
    }

    public WordWithCategoryDto findWordById(Long id) {
        return wordMapper.findById(id);
    }

    public List<WordDto> findWordsByCategoryId(Long categoryId) {
        return wordMapper.findByCategoryId(categoryId);
    }
}