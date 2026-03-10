package com.example.demo.global.exception.custom;

import com.example.demo.global.exception.code.ErrorCode;

public class EntityNotFoundException extends BusinessException {

    public EntityNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }

    public EntityNotFoundException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}
