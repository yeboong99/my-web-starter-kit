# 스타터킷 bootRun 에러 해결 및 인프라 구성 계획

## Context
Spring Initializr로 생성한 스타터킷 프로젝트(`com.example.demo`)에 JPA + PostgreSQL + Redis + Security 의존성이 포함되어 있으나, `application.yml`에 DataSource 설정이 없어 bootRun 실패. Docker Compose로 로컬 DB 환경을 구성하고, 필요한 설정을 추가하여 bootRun이 성공하도록 한다.

## 변경 파일 목록

### 1. `docker-compose.yml` (신규 생성)
- 위치: 프로젝트 루트 (`claude-code-mastery-web-starterkit/docker-compose.yml`)
- PostgreSQL 17 + Redis 7-alpine 컨테이너 구성
- 환경변수로 DB명/사용자/비밀번호 설정 (기본값: demo/demo/demo1234)
- 볼륨으로 데이터 영속성 확보

### 2. `backend/src/main/resources/application.yml` (수정)
- PostgreSQL DataSource 설정 추가 — `${DB_USER}`, `${DB_PASSWORD}` 등 환경변수 참조 (기본값 포함)
- JPA Hibernate 설정 (ddl-auto: update, show-sql: true)
- Redis 연결 설정 (host, port) — 환경변수 참조

### 3. `backend/src/main/java/com/example/demo/config/SecurityConfig.java` (신규 생성)
- `@Configuration` + `@EnableWebSecurity`
- `SecurityFilterChain` 빈 등록
- 모든 엔드포인트 `permitAll` 설정
- CSRF 비활성화 (API 서버용)
- 나중에 인증 구현 시 점진적으로 수정할 수 있는 기반

### 4. `.env` (신규 생성)
- docker-compose + application.yml에서 참조할 실제 환경변수 파일
- DB_NAME, DB_USER, DB_PASSWORD, REDIS_HOST, REDIS_PORT 등
- `.gitignore`에 추가하여 Git에 포함되지 않도록 함

### 5. `.env.default` (신규 생성)
- `.env`의 템플릿/안내 파일 (Git에 포함)
- 각 환경변수의 키와 예시값/설명을 기재
- 새 개발자가 `.env.default`를 복사하여 `.env`를 만들 수 있도록 안내

### 6. `backend/secrets/` (신규 디렉토리 생성)
- 파일 기반 secret 관리를 위한 디렉토리
- `.gitkeep` 파일을 넣어 빈 디렉토리도 Git에 추적되도록 함
- `backend/secrets/*` (`.gitkeep` 제외)를 `.gitignore`에 추가하여 실제 secret 파일은 Git에 포함되지 않도록 함

### 7. 프로젝트 루트 `.gitignore` (신규 생성)
- `.env` 추가
- 위치: `claude-code-mastery-web-starterkit/.gitignore`

### 8. `backend/.gitignore` (수정)
- 기존 파일에 `secrets/*` 추가
- `!secrets/.gitkeep` 예외 처리

## 기술 스택 호환성 검증 (공식 문서 기준)

| 기술 스택 | 버전 | 호환성 | 근거 |
|---|---|---|---|
| Java | 17 | ✅ | Spring Boot 4.0 공식 문서: "Java SDK v17 or higher" |
| Spring Boot | 4.0.3 | ✅ | 최신 안정 릴리스 |
| Spring Security | 7.x (BOM 관리) | ✅ | "Java 17 or higher Runtime Environment" |
| Spring Data JPA | BOM 관리 | ✅ | Spring Boot가 호환 버전 자동 관리 |
| PostgreSQL Driver | BOM 관리 | ✅ | runtimeOnly로 올바르게 선언 |
| Spring Session Redis | BOM 관리 | ✅ | 4.0에 자동 설정 클래스 존재 확인 |
| Lombok | BOM 관리 | ✅ | Java 17 호환, compileOnly + annotationProcessor 올바름 |
| 스타터 이름 (webmvc, *-test) | 4.0 신규 | ✅ | Spring Boot 4.0 모듈 세분화에 따른 정상 변경 |

## 검증 방법
```bash
# 1. Docker Compose로 PostgreSQL + Redis 실행
docker compose up -d

# 2. 컨테이너 상태 확인
docker compose ps

# 3. Spring Boot 기동
cd backend && ./gradlew bootRun

# 4. 기동 성공 확인 (8080 포트)
curl http://localhost:8080  # 404이면 정상 (엔드포인트 미등록 상태)
```
