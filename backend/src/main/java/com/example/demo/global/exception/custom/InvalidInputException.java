package com.example.demo.global.exception.custom;

import com.example.demo.global.exception.code.ErrorCode;

public class InvalidInputException extends BusinessException {

    public InvalidInputException(ErrorCode errorCode) {
        super(errorCode);
    }

    public InvalidInputException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}
