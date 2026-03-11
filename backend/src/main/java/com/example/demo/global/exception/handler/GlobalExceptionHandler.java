package com.example.demo.global.exception.handler;

import com.example.demo.global.dto.ApiResponse;
import com.example.demo.global.exception.code.CommonErrorCode;
import com.example.demo.global.exception.code.ErrorCode;
import com.example.demo.global.exception.custom.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();
        log.warn("비즈니스 예외 발생: [{}] {}", errorCode.name(), errorCode.getMessage());
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode.getMessage(), errorCode.name()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst()
                .orElse(CommonErrorCode.INVALID_INPUT.getMessage());
        log.warn("유효성 검증 실패: {}", message);
        return ResponseEntity
                .status(CommonErrorCode.INVALID_INPUT.getHttpStatus())
                .body(ApiResponse.error(message, CommonErrorCode.INVALID_INPUT.name()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResourceFoundException(NoResourceFoundException e) {
        log.debug("리소스를 찾을 수 없음: {}", e.getMessage());
        return ResponseEntity
                .status(CommonErrorCode.RESOURCE_NOT_FOUND.getHttpStatus())
                .body(ApiResponse.error(CommonErrorCode.RESOURCE_NOT_FOUND));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("예기치 않은 서버 오류 발생", e);
        return ResponseEntity
                .status(CommonErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus())
                .body(ApiResponse.error(CommonErrorCode.INTERNAL_SERVER_ERROR));
    }
}
