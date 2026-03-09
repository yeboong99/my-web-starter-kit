# 배포 아키텍처 문서

이 문서는 로컬 개발 환경의 구조를 정리한다.
운영 환경 배포는 별도 튜토리얼 가이드로 제공될 예정이다.

---

## 로컬 개발 환경 구조

```
브라우저
  │
  ▼
nginx (80/443)        ← mkcert 로컬 인증서로 HTTPS
  ├── /api/* ──────▶  backend:8080  (Spring Boot)
  └── /*    ──────▶  frontend:3000 (Next.js standalone)
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        postgres:5432            redis:6379
```

모든 서비스는 Docker Compose 단일 네트워크 내에서 실행됩니다.

---

## 서비스 구성

| 서비스 | 이미지 | 내부 포트 | 외부 노출 |
|--------|--------|-----------|-----------|
| nginx | nginx:alpine | 80, 443 | 80, 443 |
| frontend | 로컬 빌드 | 3000 | nginx 경유 |
| backend | 로컬 빌드 | 8080 | nginx /api/* 경유 |
| postgres | postgres:17 | 5432 | 없음 |
| redis | redis:7-alpine | 6379 | 없음 |

postgres와 redis는 Docker 내부 네트워크에서만 접근 가능합니다.

---

## 환경변수 구조

| 파일 | Git 포함 | 역할 |
|------|----------|------|
| `.env` | 제외 | 실제 환경변수 값 |
| `.env.default` | 포함 | 신규 개발자용 템플릿 |

### 주요 변수

```env
DB_HOST=postgres       # Docker 서비스명
DB_PORT=5432           # Docker 내부 포트
DB_NAME=demo
DB_USER=demo
DB_PASSWORD=demo1234

REDIS_HOST=redis       # Docker 서비스명
REDIS_PORT=6379

BACKEND_PORT=8080
CORS_ALLOWED_ORIGINS=https://localhost
NEXT_PUBLIC_API_URL=https://localhost
```

---

## Dockerfile 전략

### Backend (`backend/Dockerfile`)
- 멀티스테이지 빌드 (eclipse-temurin:17)
- Stage 1: Gradle 빌드 → JAR 생성
- Stage 2: JRE 경량 이미지에서 JAR 실행

### Frontend (`frontend/Dockerfile`)
- 멀티스테이지 빌드 (node:22-alpine)
- `ARG NEXT_PUBLIC_API_URL` — 빌드타임에 주입
- Stage 1: pnpm install → pnpm build (Next.js standalone)
- Stage 2: standalone 실행

---

## nginx 역할

- HTTP → HTTPS 리다이렉트 (80 → 443)
- mkcert 로컬 인증서로 SSL 종료
- `/api/*` → backend 프록시
- `/*` → frontend 프록시 (WebSocket 지원 포함)

---

## API 라우팅 원칙

모든 백엔드 엔드포인트는 `/api/` prefix를 사용합니다.

```
클라이언트: fetch("/api/health")
  → nginx: /api/* 규칙 매칭
  → backend: http://backend:8080/api/health
```

Next.js rewrite를 사용하지 않고 nginx가 라우팅을 전담합니다.

---

## 운영 환경 배포

운영 환경(EC2 등) 배포 방법은 별도 튜토리얼 가이드로 제공됩니다.
이 스타터킷은 로컬 개발 환경에 집중합니다.
