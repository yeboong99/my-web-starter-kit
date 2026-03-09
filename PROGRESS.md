# 작업 진행 현황

## 프로젝트 목적

Spring Boot + Next.js 기반 웹 애플리케이션 스타터킷.
Docker Compose로 전체 스택을 로컬에서 실행하는 개발 환경 제공.

---

## 완료된 작업

### 인프라 구성

- [x] `docker-compose.yml` — 전체 스택 (postgres, redis, backend, frontend, nginx)
  - postgres, redis: 호스트 포트 노출 없음 (Docker 내부 통신만)
  - backend, frontend: expose만 (nginx가 프록시)
  - nginx: 80/443 호스트 노출
- [x] `nginx/default.conf` — 리버스 프록시 + HTTPS + API 라우팅
  - HTTP(80) → HTTPS(443) 리다이렉트
  - `/api/*` → backend:8080 프록시
  - `/*` → frontend:3000 프록시 (WebSocket 지원)
- [x] `backend/Dockerfile` — 멀티스테이지 빌드
- [x] `frontend/Dockerfile` — 멀티스테이지 빌드 + `NEXT_PUBLIC_API_URL` build arg
- [x] `docker-compose.prod.yml` — 삭제 (배포는 추후 튜토리얼로 제공)

### 환경변수 관리

- [x] `.env.default` — Docker 기준 값으로 통합 (단일 파일)
  - `DB_HOST=postgres`, `DB_PORT=5432` (Docker 서비스명 기준)
  - `CORS_ALLOWED_ORIGINS=https://localhost`
  - `NEXT_PUBLIC_API_URL=https://localhost`
- [x] `.gitignore` — `.env`, `certs/` 제외 처리
- [x] `Makefile` — `include .env + export`로 자동 주입

### Spring Boot 설정

- [x] `application.yml` — 환경변수 참조, `forward-headers-strategy: framework` 추가
  - nginx 뒤에서 `X-Forwarded-Proto: https` 인식 → 쿠키 Secure 플래그 정상 작동
- [x] `SecurityConfig.java` — CORS 설정 (`CORS_ALLOWED_ORIGINS` 환경변수)
- [x] `HealthController.java` — `GET /api/health` → `{"status":"ok"}`

### 프론트엔드 설정

- [x] `next.config.ts` — `output: "standalone"` (rewrite 제거, nginx가 API 라우팅 전담)
- [x] `app/page.tsx` — 스타터킷 랜딩 페이지 (Health Check 버튼)
- [x] shadcn/ui 설치

### 로컬 HTTPS 설정 (설계 완료)

- [x] mkcert 기반 인증서 생성 명령어 구성 (`make certs`)
- [x] nginx SSL 설정 (`certs/localhost.pem`, `certs/localhost-key.pem` 참조)
- [x] `certs/` → `.gitignore` 처리 (개발자별 로컬 생성)

### Makefile 정비

- [x] 기존 `infra-up`, `infra-down`, `dev-backend`, `dev-frontend` 제거
- [x] `certs`, `up`, `down`, `logs`, `clean` 5개 명령어로 재구성

### 문서화

- [x] `README.md` — Docker Compose 기반 워크플로우로 전면 재작성
- [x] `DEPLOYMENT_ARCHITECTURE.md` — 로컬 개발 구조로 갱신, 배포는 "튜토리얼 가이드" 예정으로 변경
- [x] `ai_documents/LOCAL_TESTING_GUIDE.md` — Docker Compose 기반으로 재작성
- [x] `PROGRESS.md` — 갱신

---

## 프론트엔드 개선 (완료)

### Phase 1~5 전체 완료
- **패키지**: usehooks-ts, @tanstack/react-query v5, react-hook-form + @hookform/resolvers, zod v3, next-themes, date-fns, sonner
- **shadcn/ui 32개 컴포넌트** 설치 (Layer 1~4)
- **4개 페이지**: `/` 홈, `/examples` 예제 갤러리, `/docs` 문서, `/status` 시스템 상태
- **Route group** `app/(main)/` — Navbar(다크모드 토글 + 모바일 Sheet) + Footer
- **백엔드**: `GET /api/status` (DB, Redis 상태 + 업타임)
- **참고**: zod v4는 @hookform/resolvers 호환 불가 → zod v3 사용

---

## 미완료 / 다음 작업

### 즉시 해야 할 것 (Mac에서 이어서)

- [ ] **통합 테스트** — Mac + Docker Desktop으로 전체 스택 기동 검증
  - `brew install mkcert && mkcert -install && make certs` (최초 1회)
  - `make up` 실행
  - `https://localhost` 접속 → SSL 경고 없이 랜딩 페이지 확인
  - Health Check 버튼 → `{"status":"ok"}` 응답 확인
  - `make logs`로 각 컨테이너 로그 정상 확인

### 통합 테스트 후 작업

- [ ] Spring Security 인증 구현 (현재 `permitAll` 상태)
- [ ] API 응답 형식 표준화 (공통 응답 DTO)
- [ ] 테스트 환경 구성
- [ ] 운영 환경 배포 튜토리얼 가이드

---

## 기본값 설정 요약

| 항목 | 기본값 |
|---|---|
| DB 이름 | `demo` |
| DB 유저 | `demo` |
| DB 비밀번호 | `demo1234` |
| DB 호스트 | `postgres` (Docker 서비스명) |
| DB 포트 | `5432` (Docker 내부) |
| Redis 호스트 | `redis` (Docker 서비스명) |
| Spring Boot 포트 | `8080` |
| CORS 허용 오리진 | `https://localhost` |
| 외부 접근 URL | `https://localhost` |

---

## Mac에서 이어서 할 때 순서

```bash
# 사전 준비 (없으면 설치)
# Docker Desktop: https://www.docker.com/products/docker-desktop/
brew install mkcert

# 프로젝트 클론
git clone <repo-url>
cd my-web-starter-kit

# 초기 설정
cp .env.default .env
mkcert -install   # 로컬 CA 등록 (최초 1회)
make certs        # 인증서 생성

# 실행
make up

# 검증
# https://localhost → 랜딩 페이지
# https://localhost/api/health → {"status":"ok"}
```

---

## 트러블슈팅 기록

| 문제 | 원인 | 해결 |
|---|---|---|
| JDBC URL 파싱 오류 | `application.yml`에 shell 문법 `${VAR:-default}` 사용 | Spring Boot 문법 `${VAR:default}`으로 수정 |
| `role "demo" does not exist` | 로컬 PostgreSQL(5432)이 Docker보다 먼저 응답 | Docker 컨테이너 포트를 5433으로 변경 (구버전, 현재는 Docker 전용이라 무관) |
| Windows에서 Docker Desktop 설치 불가 | Windows 10 21H2(19044) — Docker Desktop은 22H2(19045) 이상 요구 | Mac에서 진행 |
| Windows에서 `make` 없음 | Git Bash에 make 미포함 | Mac에서는 기본 내장 (`xcode-select --install`) |
