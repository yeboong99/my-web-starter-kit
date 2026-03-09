# 작업 진행 현황

## 프로젝트 목적

Spring Boot 기반 웹 애플리케이션을 빠르게 시작할 수 있는 스타터킷 구성.
새 프로젝트 시작 시 이 레포를 기반으로 설정만 바꿔서 사용하는 것이 목표.

---

## 완료된 작업

### 인프라 구성

- [x] `docker-compose.yml` 생성
  - PostgreSQL 17 (호스트 포트 **5433** — 로컬 PostgreSQL 5432 충돌 방지)
  - Redis 7-alpine (포트 6379)
  - Named Volume으로 데이터 영속성 확보
- [x] `docker-compose.prod.yml` 생성 (override 파일)
  - backend / frontend 빌드 및 실행
  - Docker 내부 네트워크로 서비스 간 연결
- [x] `backend/Dockerfile` 생성 (멀티 스테이지 빌드)
- [x] `frontend/Dockerfile` 생성 (멀티 스테이지 빌드, standalone 출력)

### 환경변수 관리

- [x] `.env` 생성 (Git 제외) — 실제 환경변수 값 보관
- [x] `.env.default` 생성 (Git 포함) — 템플릿 파일, 새 개발자 온보딩용
  - `BACKEND_PORT`, `CORS_ALLOWED_ORIGINS`, `NEXT_PUBLIC_API_URL` 추가
- [x] `frontend/.env.local.example` 생성 — Next.js 환경변수 템플릿
- [x] 루트 `.gitignore` — `.env` 제외 처리
- [x] **Makefile 도입** — `include .env + export`로 Spring Boot에 환경변수 자동 주입

### Spring Boot 설정

- [x] `backend/src/main/resources/application.yml` 수정
  - PostgreSQL DataSource 환경변수 참조
  - JPA Hibernate 설정 (ddl-auto: update, show-sql: true)
  - Redis 연결 설정
  - `server.port: ${BACKEND_PORT:8080}` 추가
  - `cors.allowed-origins` 커스텀 프로퍼티 추가

- [x] `backend/src/main/java/com/example/demo/config/SecurityConfig.java`
  - 모든 엔드포인트 `permitAll`
  - CSRF 비활성화
  - **CORS 설정 추가** — `${CORS_ALLOWED_ORIGINS}` 환경변수 참조
  - GET, POST, PUT, DELETE, PATCH, OPTIONS 허용, credentials 허용

- [x] `backend/src/main/java/com/example/demo/controller/HealthController.java` 생성
  - `GET /api/health` → `{"status":"ok"}`
  - Docker health check 및 프론트엔드 연결 테스트용

### 프론트엔드 설정

- [x] Next.js 프로젝트 생성 (`frontend/`)
- [x] shadcn/ui 설치
- [x] `frontend/next.config.ts`
  - `/api/*` → 백엔드 프록시 rewrites 설정
  - `output: "standalone"` — Docker 배포용
- [x] `frontend/app/page.tsx` — 스타터킷 랜딩 페이지로 교체
  - 백엔드 Health Check 버튼
  - 기술 스택 정보 표시

### 시크릿 관리

- [x] `backend/secrets/` 디렉토리 생성
  - `.gitkeep` 파일로 빈 디렉토리 Git 추적
  - `backend/.gitignore`에 `secrets/*` / `!secrets/.gitkeep` 추가

### 문서화

- [x] `README.md` 작성 — Makefile 사용법, Docker 배포 워크플로우 포함
- [x] `PROGRESS.md` 작성
- [x] **AI 문서 구조 개선**
  - `ai_documents/` 디렉토리 신규 생성
  - `ai_documents/LOCAL_TESTING_GUIDE.md` 생성 — 로컬 개발 실행/테스트 가이드
  - `CLAUDE.md` 간소화 — 상세 내용을 `ai_documents/LOCAL_TESTING_GUIDE.md`로 분리, 참조 링크로 교체

### bootRun 검증

- [x] `docker compose up -d` 후 `./gradlew bootRun` 정상 기동 확인
  - `Started DemoApplication in 1.161 seconds`

---

## 트러블슈팅 기록

| 문제 | 원인 | 해결 |
|---|---|---|
| JDBC URL 파싱 오류 (`-localhost:-5432/-demo`) | `application.yml`에 shell 문법 `${VAR:-default}` 사용 | Spring Boot 문법 `${VAR:default}`으로 수정 |
| `role "demo" does not exist` | 로컬 PostgreSQL(5432)이 Docker보다 먼저 응답 | Docker 컨테이너 포트를 5433으로 변경 |

---

## 미완료 / 다음 작업 후보

- [ ] Spring Security 인증 구현 — 현재 `permitAll` 상태
- [ ] API 응답 형식 표준화 (공통 응답 DTO 등)
- [ ] 테스트 환경 구성

### Phase 1: 실행 및 검증

- [ ] 로컬 개발 환경 전체 기동 테스트 (infra-up → backend → frontend)
- [ ] 프론트엔드 → 백엔드 Health Check 연결 검증
- [ ] Docker Compose 프로덕션 빌드 검증 (`docker-compose.prod.yml`)

### Phase 2: 스타터킷 웹페이지 구성 및 메인페이지 개선

- [ ] 메인 페이지(`page.tsx`) 리디자인 — 스타터킷 소개, 기능 목록, 퀵스타트 가이드
- [ ] 공통 레이아웃 구성 — 네비게이션 바, 푸터
- [ ] 글로벌 스타일 및 테마 설정

### Phase 3: 예제 페이지 및 유틸리티 구성

- [ ] 예제 페이지: CRUD 데모, 폼 처리, API 연동 예시 등
- [ ] 공통 유틸리티: API 클라이언트, 에러 핸들링, 공통 응답 DTO
- [ ] 백엔드 예제 API 엔드포인트 추가

---

## 현재 기본값 설정 요약

| 항목 | 기본값 |
|---|---|
| DB 이름 | `demo` |
| DB 유저 | `demo` |
| DB 비밀번호 | `demo1234` |
| DB 포트 (호스트) | `5433` |
| Redis 포트 | `6379` |
| Spring Boot 포트 | `8080` |
| CORS 허용 오리진 | `http://localhost:3000` |
| 프론트엔드 포트 | `3000` |

> 새 프로젝트 시작 시 `.env`를 수정하고 `docker compose down -v && docker compose up -d`로 재생성.

---

## 다음 작업 시 참고사항

- 로컬에 PostgreSQL이 5432 포트로 실행 중이므로 Docker는 **5433** 사용 중
- `docker compose up -d` 후 `bootRun` 순서 지켜야 함
- 작업 재개 전 반드시 `docker compose up -d` 먼저 실행
- Makefile 사용 시 `.env` 파일이 루트에 있어야 함 (`cp .env.default .env`)
