# Web Starter Kit

Spring Boot + Next.js 기반 웹 애플리케이션 스타터킷입니다.
모든 서비스를 Docker Compose로 실행하는 로컬 개발 환경을 제공합니다.

## 기술 스택

| 분류            | 기술                                      |
| --------------- | ----------------------------------------- |
| Language        | Java 17                                   |
| Framework       | Spring Boot 4.0.3                         |
| ORM             | Spring Data JPA + Hibernate               |
| Database        | PostgreSQL 17                             |
| Cache / Session | Redis 7                                   |
| Security        | Spring Security 7                         |
| Build           | Gradle                                    |
| Frontend        | Next.js 16 (App Router) + Tailwind CSS v4 |
| UI Components   | shadcn/ui                                 |
| 상태관리        | React Query v5                            |
| 언어            | React 19, TypeScript 5                    |
| 패키지 매니저   | pnpm                                      |
| 인프라          | Docker Compose + nginx                    |

## 프로젝트 구조

```
my-web-starter-kit/
├── backend/                        # Spring Boot 애플리케이션
│   ├── src/main/
│   │   ├── java/com/example/demo/
│   │   │   └── global/
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java       # CORS + Security 설정
│   │   │       ├── controller/
│   │   │       │   ├── HealthController.java     # GET /api/health
│   │   │       │   └── StatusController.java     # GET /api/status
│   │   │       ├── dto/
│   │   │       │   └── ApiResponse.java          # 공통 응답 형식 (Record)
│   │   │       └── exception/
│   │   │           ├── code/
│   │   │           │   ├── ErrorCode.java        # 에러 코드 인터페이스
│   │   │           │   └── CommonErrorCode.java  # 공통 에러 코드 enum
│   │   │           ├── custom/
│   │   │           │   └── BusinessException.java
│   │   │           └── handler/
│   │   │               └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       └── application.yml
│   └── Dockerfile
├── frontend/                       # Next.js 애플리케이션
│   ├── app/
│   │   └── (main)/                 # Route Group
│   │       ├── page.tsx            # 홈 (/)
│   │       ├── docs/page.tsx       # 문서 (/docs)
│   │       ├── examples/page.tsx   # 예제 (/examples)
│   │       └── status/page.tsx     # 상태 (/status)
│   ├── components/
│   │   ├── home/                   # 홈 페이지 컴포넌트
│   │   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── status/                 # 상태 페이지 컴포넌트
│   │   ├── docs/                   # 문서 페이지 컴포넌트
│   │   ├── examples/               # 예제 페이지 컴포넌트
│   │   └── ui/                     # shadcn/ui 컴포넌트 (~30개)
│   ├── lib/
│   │   ├── api.ts                  # fetchHealth, fetchStatus
│   │   ├── query-provider.tsx      # React Query 설정
│   │   └── utils.ts
│   ├── next.config.ts              # standalone 출력 모드
│   └── Dockerfile
├── nginx/
│   └── default.conf                # SSL + 리버스 프록시 설정
├── ai_documents/                   # AI 가이드 문서
├── certs/                          # mkcert 로컬 인증서 (.gitignore 처리)
├── docker-compose.yml              # 전체 스택 (5개 서비스)
├── Makefile                        # 개발 명령어
├── CLAUDE.md                       # Claude Code 가이드
├── .env                            # 환경변수 실제 값 (.gitignore 처리)
└── .env.default                    # 환경변수 템플릿 (Git 포함)
```

---

## 빠른 시작

### 사전 요구사항

- Docker Desktop
- [mkcert](https://github.com/FiloSottile/mkcert) (로컬 HTTPS 인증서 생성용)

### 1단계: 초기 설정 (최초 1회)

```bash
# 환경변수 파일 생성
cp .env.default .env

# 로컬 CA 등록 및 인증서 생성 (관리자 권한 필요)
mkcert -install
make certs
```

### 2단계: 전체 스택 실행

```bash
make up
```

브라우저에서 `https://localhost` 접속 후 **Health Check** 버튼으로 백엔드 연결을 확인합니다.

---

## Makefile 명령어

| 명령어 | 설명 |
|---|---|
| `make certs` | mkcert로 로컬 SSL 인증서 생성 |
| `make up` | 전체 스택 빌드 및 실행 |
| `make up-clean` | 볼륨 삭제 후 전체 스택 빌드 및 실행 |
| `make down` | 전체 스택 중지 |
| `make logs` | 전체 서비스 로그 확인 |
| `make clean` | 컨테이너 + 볼륨 전체 삭제 |

---

## 서비스 구성

```
브라우저 → nginx (80/443)
              ├── /api/* → backend:8080
              └── /*     → frontend:3000
```

| 서비스 | 내부 포트 | 외부 접근 |
|--------|-----------|-----------|
| nginx | 80, 443 | https://localhost |
| frontend | 3000 | nginx 경유 |
| backend | 8080 | nginx /api/* 경유 |
| postgres | 5432 | Docker 내부만 |
| redis | 6379 | Docker 내부만 |

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/health` | 서버 상태 확인 |
| `GET` | `/api/status` | DB, Redis 연결 상태 + 업타임 |

모든 백엔드 엔드포인트는 `/api/` prefix를 사용합니다.
nginx가 `/api/*` 요청을 backend로 프록시합니다.

```typescript
// 프론트엔드 코드에서
fetch("/api/health")  // → nginx → http://backend:8080/api/health
fetch("/api/status")  // → nginx → http://backend:8080/api/status
```

공통 응답 형식 (`ApiResponse<T>`):

```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

---

## Security 설정

`SecurityConfig.java`는 현재 **모든 엔드포인트를 허용**하는 최소 설정 상태입니다.
인증이 필요한 경우 점진적으로 보안 정책을 추가하세요.

CORS는 `CORS_ALLOWED_ORIGINS` 환경변수로 제어합니다 (기본값: `https://localhost`).

---

## 패키지명 / 프로젝트명 변경

**`settings.gradle`**
```groovy
rootProject.name = 'myproject'  // 'demo' → 변경
```

**`build.gradle`**
```groovy
group = 'com.mycompany'  // 'com.example' → 변경
```

패키지 디렉토리는 IDE의 Refactor → Rename 기능으로 변경합니다.

---

## DB 계정 설정 원리

`.env`에 값을 설정하고 `make up`을 **최초 실행**하면 PostgreSQL이 자동으로 DB와 유저를 생성합니다.

**주의: 최초 실행 이후에는 `.env`를 변경해도 계정이 자동으로 바뀌지 않습니다.**
계정 정보를 변경하려면 볼륨을 삭제하고 재실행해야 합니다.

```bash
make clean
make up
```

