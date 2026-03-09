# Web Starter Kit

Spring Boot + Next.js 기반 웹 애플리케이션 스타터킷입니다.
이 레포를 기반으로 새 프로젝트를 시작할 때 아래 튜토리얼을 따라 환경을 구성하세요.

## 기술 스택

| 분류            | 기술                        |
| --------------- | --------------------------- |
| Language        | Java 17                     |
| Framework       | Spring Boot 4.0.3           |
| ORM             | Spring Data JPA + Hibernate |
| Database        | PostgreSQL 17               |
| Cache / Session | Redis 7                     |
| Security        | Spring Security 7           |
| Build           | Gradle                      |
| Frontend        | Next.js 16 + Tailwind CSS   |
| UI Components   | shadcn/ui                   |
| 인프라          | Docker Compose              |

## 프로젝트 구조

```
my-web-starter-kit/
├── backend/                        # Spring Boot 애플리케이션
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/demo/
│   │       │   ├── config/
│   │       │   │   └── SecurityConfig.java   # CORS + Security 설정
│   │       │   └── controller/
│   │       │       └── HealthController.java # GET /api/health
│   │       └── resources/
│   │           └── application.yml
│   ├── secrets/                    # 파일 기반 시크릿 보관 디렉토리 (.gitignore 처리)
│   ├── Dockerfile                  # 멀티 스테이지 빌드
│   └── build.gradle
├── frontend/                       # Next.js 애플리케이션
│   ├── app/
│   │   └── page.tsx                # 스타터 랜딩 페이지
│   ├── components/ui/              # shadcn/ui 컴포넌트
│   ├── .env.local.example          # 환경변수 템플릿
│   ├── next.config.ts              # API 프록시 + standalone 설정
│   └── Dockerfile                  # 멀티 스테이지 빌드
├── docker-compose.yml              # 로컬 인프라 (PostgreSQL + Redis)
├── docker-compose.prod.yml         # 프로덕션 override (backend + frontend 빌드)
├── Makefile                        # 개발 명령어 모음
├── .env                            # 환경변수 실제 값 (.gitignore 처리)
└── .env.default                    # 환경변수 템플릿 (Git 포함)
```

---

## 빠른 시작

### 1단계: 환경변수 설정

```bash
cp .env.default .env
```

`.env`를 열어 프로젝트에 맞게 수정합니다.

### 2단계: 로컬 개발 실행

```bash
# 인프라 기동 (PostgreSQL + Redis)
make infra-up

# 백엔드 실행 (터미널 1)
make dev-backend

# 프론트엔드 실행 (터미널 2)
make dev-frontend
```

브라우저에서 `http://localhost:3000` 접속 후 **Health Check** 버튼으로 백엔드 연결을 확인합니다.

### 3단계: Docker 배포

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

---

## Makefile 명령어

| 명령어 | 설명 |
|---|---|
| `make infra-up` | PostgreSQL + Redis 컨테이너 기동 |
| `make infra-down` | 컨테이너 중지 (데이터 유지) |
| `make dev-backend` | Spring Boot 개발 서버 실행 |
| `make dev-frontend` | Next.js 개발 서버 실행 |
| `make clean` | 컨테이너 + 볼륨 전체 삭제 |

> Makefile은 `.env`를 자동으로 로드하여 Spring Boot에 환경변수를 주입합니다.

---

## 프론트엔드 설정

### 환경변수

```bash
# frontend/.env.local 생성
cp frontend/.env.local.example frontend/.env.local
```

Next.js는 `.env.local`을 자동으로 읽습니다. `NEXT_PUBLIC_` 접두사가 붙은 변수는 브라우저에서도 접근 가능합니다.

### API 프록시

`next.config.ts`에 설정된 rewrites로 인해, 프론트엔드에서 `/api/*` 요청은 자동으로 백엔드로 프록시됩니다.

```typescript
// 프론트엔드 코드에서
fetch("/api/health")  // → http://localhost:8080/api/health 로 프록시
```

---

## 상세 설정 튜토리얼

### 환경변수 파일 상세 설명

```dotenv
# .env
DB_HOST=localhost
DB_PORT=5433          # 로컬 PostgreSQL과 포트 충돌 방지 (기본 5432 대신 5433 사용)
DB_NAME=myproject     # 프로젝트 DB명으로 변경
DB_USER=myuser        # 사용할 DB 유저명으로 변경
DB_PASSWORD=secret    # 안전한 비밀번호로 변경

REDIS_HOST=localhost
REDIS_PORT=6379

BACKEND_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> `.env`는 `.gitignore`에 등록되어 Git에 커밋되지 않습니다.

### 패키지명 / 프로젝트명 변경

**`settings.gradle`**

```groovy
rootProject.name = 'myproject'  // 'demo' → 변경
```

**`build.gradle`**

```groovy
group = 'com.mycompany'  // 'com.example' → 변경
```

**패키지 디렉토리 이동**

IntelliJ 기준: `com.example.demo` 패키지를 우클릭 → Refactor → Rename

---

## DB 계정 설정 원리

`.env`에 값을 설정하고 `docker compose up -d`를 **최초 실행**하면 PostgreSQL 이미지가 자동으로 DB와 유저를 생성합니다.

**주의: 최초 실행 이후에는 `.env`를 변경해도 계정이 자동으로 바뀌지 않습니다.**
계정 정보를 변경하려면 볼륨을 삭제하고 다시 실행해야 합니다.

```bash
docker compose down -v
docker compose up -d
```

---

## 일반적인 개발 워크플로우

```bash
# 작업 시작
make infra-up
make dev-backend   # 터미널 1
make dev-frontend  # 터미널 2

# 작업 종료 (데이터 유지)
make infra-down

# DB 초기화가 필요할 때
make clean
make infra-up
```

---

## 시크릿 파일 관리

파일 기반 시크릿(API 키, 인증서 등)은 `backend/secrets/` 디렉토리에 보관합니다.
이 디렉토리는 `.gitignore`에 등록되어 Git에 포함되지 않습니다.

```bash
backend/secrets/
├── .gitkeep         # Git 추적용 (비어있음)
├── firebase.json    # 예시 — Git에 포함되지 않음
└── gcp-key.json     # 예시 — Git에 포함되지 않음
```

---

## Security 설정

`SecurityConfig.java`는 현재 **모든 엔드포인트를 허용**하는 최소 설정 상태입니다.
인증이 필요한 경우 점진적으로 보안 정책을 추가하세요.

```java
// 인증 적용 예시
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/public/**").permitAll()
    .anyRequest().authenticated()
)
```

CORS는 `CORS_ALLOWED_ORIGINS` 환경변수로 제어합니다.

```dotenv
# 다중 오리진 허용 (쉼표 구분)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://myapp.com
```
