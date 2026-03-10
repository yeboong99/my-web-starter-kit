package com.example.demo.global.exception.custom;

import com.example.demo.global.exception.code.ErrorCode;

public class DuplicateException extends BusinessException {

    public DuplicateException(ErrorCode errorCode) {
        super(errorCode);
    }

    public DuplicateException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}
