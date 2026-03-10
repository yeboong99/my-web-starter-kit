# Exception 패키지 세분화

## Context

현재 `global/exception/` 안에 7개 파일이 역할 구분 없이 한 디렉토리에 위치.
에러코드 정의(인터페이스/enum), 예외 클래스(추상/구체), 핸들러가 섞여 있어 처음 보는 사람이 용도를 파악하기 어려움.

**해결:** `global/exception/` 이름은 유지하면서, 역할별로 `code`, `custom`, `handler` 하위 패키지로 세분화.

---

## 변경 전/후 구조

```
# 현재 (Before) - 7개 파일이 flat하게 혼재
global/exception/
├── ErrorCode.java              ← 인터페이스
├── CommonErrorCode.java        ← enum
├── BusinessException.java      ← 추상 클래스
├── EntityNotFoundException.java ← 구체 예외
├── DuplicateException.java     ← 구체 예외
├── InvalidInputException.java  ← 구체 예외
└── GlobalExceptionHandler.java ← 핸들러

# 변경 후 (After) - 역할별 하위 패키지
global/exception/
├── code/                        ← 에러 코드 정의
│   ├── ErrorCode.java
│   └── CommonErrorCode.java
├── custom/                      ← 직접 정의한 예외 클래스
│   ├── BusinessException.java
│   ├── EntityNotFoundException.java
│   ├── DuplicateException.java
│   └── InvalidInputException.java
└── handler/                     ← 예외 핸들러
    └── GlobalExceptionHandler.java
```

**설계 근거:**
- `exception` 패키지명 유지 — Spring Boot 프로젝트에서 가장 보편적인 관례
- `code/` : 에러 코드 정의. 향후 도메인별 `UserErrorCode`, `OrderErrorCode`도 여기 추가
- `custom/` : 직접 정의한 예외 클래스. "어떤 예외를 던질 수 있지?" → 여기만 확인
- `handler/` : 예외 처리 로직. `@RestControllerAdvice` 클래스 모음

---

## 구현 순서

### 1. 새 디렉토리에 파일 생성 (패키지 선언 변경)

기준 경로: `backend/src/main/java/com/example/demo/global/`

| 현재 위치 | 새 위치 | 새 패키지 |
|-----------|---------|-----------|
| `exception/ErrorCode.java` | `exception/code/ErrorCode.java` | `global.exception.code` |
| `exception/CommonErrorCode.java` | `exception/code/CommonErrorCode.java` | `global.exception.code` |
| `exception/BusinessException.java` | `exception/custom/BusinessException.java` | `global.exception.custom` |
| `exception/EntityNotFoundException.java` | `exception/custom/EntityNotFoundException.java` | `global.exception.custom` |
| `exception/DuplicateException.java` | `exception/custom/DuplicateException.java` | `global.exception.custom` |
| `exception/InvalidInputException.java` | `exception/custom/InvalidInputException.java` | `global.exception.custom` |
| `exception/GlobalExceptionHandler.java` | `exception/handler/GlobalExceptionHandler.java` | `global.exception.handler` |

### 2. import문 수정

패키지가 변경되므로 내부/외부 import문 업데이트 필요:

| 파일 | 변경할 import |
|------|---------------|
| `CommonErrorCode.java` | `ErrorCode` 같은 패키지 → 변경 없음 |
| `BusinessException.java` | + `import ...global.exception.code.ErrorCode` |
| `EntityNotFoundException.java` | + `import ...global.exception.code.ErrorCode` |
| `DuplicateException.java` | + `import ...global.exception.code.ErrorCode` |
| `InvalidInputException.java` | + `import ...global.exception.code.ErrorCode` |
| `GlobalExceptionHandler.java` | `ApiResponse` → `...global.dto.ApiResponse`, + `...global.exception.code.ErrorCode`, + `...global.exception.code.CommonErrorCode`, + `...global.exception.custom.BusinessException` |
| `ApiResponse.java` (외부) | `...global.exception.ErrorCode` → `...global.exception.code.ErrorCode` |

### 3. 기존 파일 삭제

`global/exception/` 루트에 있던 7개 원본 파일 삭제 (하위 패키지로 이동 완료 후)

---

## 수정 대상 파일 (총 8개)

| 파일 | 작업 |
|------|------|
| `ErrorCode.java` | 패키지 변경 → `global.exception.code` |
| `CommonErrorCode.java` | 패키지 변경 → `global.exception.code` |
| `BusinessException.java` | 패키지 변경 + import 추가 → `global.exception.custom` |
| `EntityNotFoundException.java` | 패키지 변경 + import 추가 → `global.exception.custom` |
| `DuplicateException.java` | 패키지 변경 + import 추가 → `global.exception.custom` |
| `InvalidInputException.java` | 패키지 변경 + import 추가 → `global.exception.custom` |
| `GlobalExceptionHandler.java` | 패키지 변경 + import 전면 수정 → `global.exception.handler` |
| `ApiResponse.java` | import 경로만 수정 (파일 위치 유지) |

---

## 검증 방법

1. `./gradlew compileJava` — 컴파일 성공 확인
2. `make down && make up` — 전체 스택 재빌드
3. `curl -sk https://localhost/api/health` → 정상 응답
4. `curl -sk https://localhost/api/status` → 정상 응답
5. `curl -sk https://localhost/api/nonexistent` → `GlobalExceptionHandler` 동작 확인 (`RESOURCE_NOT_FOUND`)
