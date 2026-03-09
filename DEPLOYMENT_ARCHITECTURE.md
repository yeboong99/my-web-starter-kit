# 배포 아키텍처 문서

이 문서는 로컬 개발 환경과 EC2 운영 환경의 배포 구조를 정리한다.

---

## 전체 구조 개요

```
로컬 개발                          EC2 운영
─────────────────────              ─────────────────────────────
 JVM (Spring Boot)      →           Docker: backend
 Node.js (Next.js)      →           Docker: frontend
 Docker: PostgreSQL      →           Docker: PostgreSQL
 Docker: Redis           →           Docker: Redis
                                     Docker: Nginx (80/443 공개)
```

---

## 로컬 개발 환경

### 구성 방식
- **인프라(DB, Redis)**: Docker로 실행
- **애플리케이션(Backend, Frontend)**: 로컬 JVM/Node.js로 직접 실행
- **포트**: 모든 서비스 포트가 호스트에 노출됨 (디버깅 편의)

### Makefile 명령어

```makefile
include .env
export              # .env 변수를 subprocess에 자동 전달
```

| 명령어 | 동작 |
|--------|------|
| `make infra-up` | PostgreSQL + Redis 컨테이너 시작 |
| `make dev-backend` | Spring Boot 로컬 실행 (`./gradlew bootRun`) |
| `make dev-frontend` | Next.js 개발 서버 실행 (`pnpm dev`) |
| `make infra-down` | 컨테이너 중지 (데이터 보존) |
| `make clean` | 컨테이너 + 볼륨 완전 삭제 |

### 포트 구성

| 서비스 | 로컬 포트 | 비고 |
|--------|-----------|------|
| Backend | 8080 | JVM 직접 실행 |
| Frontend | 3000 | Node.js 직접 실행 |
| PostgreSQL | 5433 | 로컬 5432 충돌 방지 |
| Redis | 6379 | 기본값 |

---

## EC2 운영 환경

### 구성 방식
- **모든 서비스**: Docker 컨테이너로 실행
- **외부 노출**: Nginx만 80/443 포트 공개
- **내부 통신**: Docker 네트워크 (서비스명을 hostname으로 사용)

### 서비스 간 통신

```
인터넷 → Nginx(80/443) → frontend(3000) : 프론트엔드 요청
                       → backend(8080)  : /api/* 요청
backend → postgres(5432)
backend → redis(6379)
```

### Nginx 역할
- 단일 진입점 (Reverse Proxy)
- 도메인 기반 라우팅
- SSL/HTTPS 종료
- 프론트엔드 / 백엔드 API 트래픽 분리

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://frontend:3000;
    }

    location /api/ {
        proxy_pass http://backend:8080;
    }
}
```

---

## docker-compose 설정

### `docker-compose.yml` (로컬 개발용)
- PostgreSQL 17 (호스트 포트 5433)
- Redis 7-alpine (포트 6379)
- 호스트에 포트 노출 → 로컬 직접 접근 가능
- Named Volume으로 데이터 영속성 유지

### `docker-compose.prod.yml` (운영용 오버라이드)
- 기본 명령: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build`
- backend/frontend Docker 이미지 빌드 포함
- `ports` 대신 `expose` 사용 (내부 통신만)
- Nginx 서비스 추가 (80, 443 포트 공개)

---

## Dockerfile 전략

### Backend (`backend/Dockerfile`)
- **멀티스테이지 빌드** (eclipse-temurin:17)
- Stage 1: Gradle 빌드 → JAR 생성 (`./gradlew build -x test`)
- Stage 2: JRE만 포함한 경량 이미지에서 JAR 실행
- 포트: 8080

### Frontend (`frontend/Dockerfile`)
- **멀티스테이지 빌드** (node:22-alpine)
- Stage 1: pnpm install → pnpm build (Next.js standalone 출력)
- Stage 2: standalone 파일 + static + public 복사 후 실행
- 포트: 3000
- `NODE_ENV=production`

---

## .env 전략

### 파일 구조

| 파일 | Git 포함 | 역할 |
|------|----------|------|
| `.env` | 제외 | 실제 환경변수 (로컬/운영 값) |
| `.env.default` | 포함 | 신규 개발자용 템플릿 |

### 주요 변수

```env
# DB
DB_HOST=localhost          # 로컬: localhost, 운영 Docker: postgres
DB_PORT=5433               # 로컬: 5433, 운영 Docker 내부: 5432
DB_NAME=demo
DB_USER=demo
DB_PASSWORD=demo1234

# Redis
REDIS_HOST=localhost        # 로컬: localhost, 운영: redis
REDIS_PORT=6379

# App
BACKEND_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
SPRING_PROFILES_ACTIVE=local
```

### 환경별 차이점

| 변수 | 로컬 | EC2 운영 |
|------|------|----------|
| `DB_HOST` | localhost | postgres |
| `DB_PORT` | 5433 | 5432 |
| `REDIS_HOST` | localhost | redis |
| `SPRING_PROFILES_ACTIVE` | local | prod |
| `CORS_ALLOWED_ORIGINS` | http://localhost:3000 | https://your-domain.com |
| `NEXT_PUBLIC_API_URL` | http://localhost:8080 | https://your-domain.com |

---

## GitHub Actions CI/CD

### 워크플로우 흐름

```
main 브랜치 Push
    ↓
[Build & Push]
Docker 이미지 빌드 → GitHub Container Registry (ghcr.io) Push
    ↓
[Deploy]
EC2 SSH 접속 → 최신 이미지 Pull → docker-compose 재시작
```

### 필요한 GitHub Secrets

| Secret | 설명 |
|--------|------|
| `EC2_HOST` | EC2 퍼블릭 IP 또는 도메인 |
| `EC2_USER` | SSH 사용자명 (ubuntu / ec2-user) |
| `EC2_SSH_KEY` | PEM 개인키 내용 |

### 워크플로우 예시 구조

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  build-and-push:
    # ghcr.io에 backend/frontend 이미지 빌드 & 푸시

  deploy:
    needs: build-and-push
    # EC2 SSH → docker compose pull → docker compose up -d
```

---

## EC2 초기 설정 절차

```bash
# 1. 코드 클론
git clone <repo-url>
cd my-web-starter-kit

# 2. .env 파일 생성 (운영 값으로)
cp .env.default .env
vi .env   # 운영 환경 값으로 수정

# 3. 서비스 시작
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. EC2 보안 그룹: 80, 443 포트 개방 필요
```

---

## 향후 구체화 필요 항목

- [ ] Nginx 설정 파일 실제 작성 (`nginx/nginx.conf`)
- [ ] `docker-compose.prod.yml` Nginx 서비스 추가
- [ ] GitHub Actions 워크플로우 파일 작성 (`.github/workflows/deploy.yml`)
- [ ] EC2 보안 그룹 설정 가이드
- [ ] HTTPS/SSL 설정 (Let's Encrypt + Certbot 또는 ACM)
- [ ] 운영 환경 시크릿 관리 방안 결정 (`.env` 파일 vs AWS Secrets Manager)
- [ ] 헬스체크 엔드포인트 및 모니터링 전략
