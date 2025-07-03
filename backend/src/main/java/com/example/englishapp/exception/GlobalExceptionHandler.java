package com.example.englishapp.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// @RestControllerAdvice: このアノテーションを付けると、すべての@RestControllerで発生した例外をこのクラスが横断的に捕捉できるようになる。
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        // 発生したすべてのバリデーションエラーをループ処理
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField(); // エラーが発生したフィールド名 (例: "name")
            String errorMessage = error.getDefaultMessage();  // アノテーションに設定したメッセージ（例：CategoryCreateRequest.javaの@NotBlank(message = "Category name is required.")）
            errors.put(fieldName, errorMessage);
        });

        // ログには詳細な情報を残す
        log.warn("Validation failed: {}", errors);

        // クライアントには最初のエラーメッセージだけを返す（シンプルにするため）
        // もしくはエラーオブジェクト全体を返しても良い
        String firstErrorMessage = errors.values().stream().findFirst().orElse("Invalid input.");
        Map<String, String> errorResponse = Map.of("message", firstErrorMessage);

        // バリデーションエラーなので 400 Bad Request を返す
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleResourceAlreadyExists(ResourceAlreadyExistsException ex) {
        log.warn(ex.getMessage());
        Map<String, String> errorResponse = Map.of("message", ex.getMessage());
        // ステータスコードは@ResponseStatusで設定済みだが、明示的に返しても良い
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // すべての@RestController内で「DataIntegrityViolationException」が発生した際の共通処理を行う
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMessage());

        // DBエンジンおよびDBメッセージフォーマットに依存するため、各Service層でメッセージを定義
        // // エラーメッセージから重複に関する情報があるかを確認（ユニーク制約違反の場合）
        // if (ex.getMostSpecificCause().getMessage().contains("Duplicate entry")) {
        //     // ユーザーフレンドリーなメッセージを作成
        //     Map<String, String> errorResponse = Map.of("message", "This category name already exists.");
        //     // 409 Conflict ステータスを返す
        //     return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        // }

        // その他のDB制約違反の場合
        Map<String, String> errorResponse = Map.of("message", "Database error occurred.");
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    // その他の予期せぬ例外を捕捉する汎用ハンドラ
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        log.error("An unexpected error occurred", ex);
        Map<String, String> errorResponse = Map.of("message", "An unexpected server error occurred.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}