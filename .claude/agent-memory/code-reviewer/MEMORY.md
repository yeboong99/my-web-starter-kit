# Code Reviewer Agent Memory

## 프로젝트 개요
Spring Boot 4 + Next.js 16 풀스택 스타터킷. Docker Compose 기반 통합 실행.
패키지: `com.example.demo`

## 확인된 아키텍처 패턴

### 백엔드
- `global/config/` — SecurityConfig (CORS + permitAll 설정)
- `global/controller/` — HealthController, StatusController
- `global/dto/` — ApiResponse<T> (Record 타입, @JsonInclude NON_NULL)
- `global/exception/code/` — ErrorCode 인터페이스, CommonErrorCode enum
- `global/exception/custom/` — BusinessException(추상), EntityNotFoundException, DuplicateException, InvalidInputException
- `global/exception/handler/` — GlobalExceptionHandler (@RestControllerAdvice)
- 도메인 엔티티 없음 (스타터킷 상태)

### 프론트엔드
- App Router + Route Group `(main)/`
- `lib/api.ts` — fetchHealth, fetchStatus (타입 없음)
- `lib/query-provider.tsx` — QueryClient (staleTime: 60s, retry: 1)
- `components/status/`, `home/`, `layout/`, `examples/`, `ui/` 구조

## 반복 발견 이슈 (이 프로젝트)

### 백엔드
1. **StatusController**: `@Autowired` 필드 주입 사용 → 생성자 주입 권장
2. **StatusController**: 레이어 아키텍처 위반 — DB/Redis 체크 로직이 Controller에 직접 구현
3. **StatusController**: `getConnection().ping()` deprecated API 사용 (RedisTemplate)
4. **application.yml**: `ddl-auto: update` — 운영 환경 위험, `validate`로 변경 필요
5. **application.yml**: `show-sql: true` — 운영 환경 성능 저하
6. **GlobalExceptionHandler**: Exception 핸들러에 로깅 없음 (서버 오류 추적 불가)
7. **SecurityConfig**: `setAllowedHeaders(List.of("*"))` — 와일드카드 허용
8. **Dockerfile (backend)**: `-x test` 플래그로 테스트 스킵

### 프론트엔드
1. **api.ts**: API 반환 타입 없음 (`any` 묵시적 반환), ApiResponse 타입 정의 필요
2. **status/page.tsx**: `HealthData` 인터페이스가 로컬에만 정의 (중복 가능성)
3. **status/page.tsx**: `"use client"` 전체 페이지에 적용 — Server Component 분리 가능
4. **connection-test.tsx**: catch 블록에서 에러 파라미터 `e` 타입 미선언
5. **Dockerfile (frontend)**: 두 번째 Stage에서 non-root 유저 미설정

### 인프라
1. **.env 파일 Git 추적**: `.env`가 `.gitignore`에 있으나 `.env`가 실제 저장소에 존재하고 기본값 노출
2. **docker-compose.yml**: healthcheck 미설정 (depends_on만 있음)
3. **nginx**: SSL 프로토콜/암호 스위트 미지정, 보안 헤더 미설정
4. **Makefile**: `include .env` — .env 없을 때 에러 발생

## 잘 설계된 부분
- ErrorCode 인터페이스 + CommonErrorCode enum 패턴 (확장성 우수)
- BusinessException 계층 구조 (추상 클래스 → 구체 예외)
- ApiResponse Record 타입 + @JsonInclude NON_NULL
- GlobalExceptionHandler의 MethodArgumentNotValidException 처리
- QueryProvider useState 패턴 (리렌더링 방지)
- Next.js standalone 출력 모드 + 멀티스테이지 Docker 빌드
- Tailwind CSS v4 + shadcn/ui 올바른 사용
- form-example.tsx의 zod + react-hook-form 패턴

## 참고 파일 경로
- `/backend/src/main/resources/application.yml`
- `/backend/src/main/java/com/example/demo/global/exception/handler/GlobalExceptionHandler.java`
- `/frontend/lib/api.ts`
- `/nginx/default.conf`
- `/docker-compose.yml`
