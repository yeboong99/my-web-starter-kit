# Web Starterkit

Spring Boot 기반 웹 애플리케이션 스타터킷입니다.
이 프로젝트를 기반으로 새 프로젝트를 시작할 때 아래 설정 튜토리얼을 따라 환경을 구성하세요.

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
| 인프라          | Docker Compose              |

## 프로젝트 구조

```
claude-code-mastery-web-starterkit/
├── backend/                        # Spring Boot 애플리케이션
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/demo/
│   │       │   └── config/
│   │       │       └── SecurityConfig.java
│   │       └── resources/
│   │           └── application.yml
│   ├── secrets/                    # 파일 기반 시크릿 보관 디렉토리 (.gitignore 처리)
│   └── build.gradle
├── frontend/                       # 프론트엔드 (별도 구성)
├── docker-compose.yml              # PostgreSQL + Redis 로컬 인프라
├── .env                            # 환경변수 실제 값 (.gitignore 처리)
└── .env.default                    # 환경변수 템플릿 (Git 포함)
```

---

## 설정 튜토리얼

새 프로젝트 시작 시 아래 순서대로 설정하세요.

### 1단계: 환경변수 파일 설정

`.env.default`를 복사하여 `.env`를 만들고 값을 수정합니다.

```bash
cp .env.default .env
```

`.env` 파일을 열어 프로젝트에 맞게 수정합니다.

```dotenv
DB_HOST=localhost
DB_PORT=5433          # 로컬 PostgreSQL과 포트 충돌 방지 (기본 5432 대신 5433 사용)
DB_NAME=myproject     # 프로젝트 DB명으로 변경
DB_USER=myuser        # 사용할 DB 유저명으로 변경
DB_PASSWORD=secret    # 안전한 비밀번호로 변경

REDIS_HOST=localhost
REDIS_PORT=6379
```

> `.env`는 `.gitignore`에 등록되어 있어 Git에 커밋되지 않습니다.

---

### 2단계: docker-compose.yml 확인

`docker-compose.yml`의 환경변수는 `.env`를 자동으로 참조합니다.
별도 수정 없이 그대로 사용 가능합니다.

```yaml
# docker-compose.yml (참고용 — 수정 불필요)
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: ${DB_NAME:-demo}
      POSTGRES_USER: ${DB_USER:-demo}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-demo1234}
    ports:
      - "5433:5432" # 호스트:컨테이너
```

---

### 3단계: application.yml 확인

`backend/src/main/resources/application.yml`은 환경변수를 참조하도록 설정되어 있습니다.
Spring Boot의 플레이스홀더 문법(`${변수명:기본값}`)을 사용합니다.

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5433}/${DB_NAME:demo}
    username: ${DB_USER:demo}
    password: ${DB_PASSWORD:demo1234}
```

환경변수가 설정되어 있으면 해당 값을 사용하고, 없으면 `:` 뒤의 기본값을 사용합니다.

---

### 4단계: 패키지명 / 프로젝트명 변경

스타터킷의 기본 패키지명 `com.example.demo`를 프로젝트에 맞게 변경합니다.

**`settings.gradle`**

```groovy
// 변경 전
rootProject.name = 'demo'

// 변경 후
rootProject.name = 'myproject'
```

**`build.gradle`**

```groovy
// 변경 전
group = 'com.example'

// 변경 후
group = 'com.mycompany'
```

**패키지 디렉토리 이동**

IntelliJ 기준: `com.example.demo` 패키지를 우클릭 → Refactor → Rename

---

### 5단계: Docker Compose 기동 및 애플리케이션 실행

```bash
# PostgreSQL + Redis 컨테이너 기동
docker compose up -d

# 컨테이너 상태 확인
docker compose ps

# Spring Boot 실행
cd backend
./gradlew bootRun

# 정상 기동 확인 (404면 정상 — 엔드포인트 미등록 상태)
curl http://localhost:8080
```

---

## DB 계정 설정 원리

`.env`에 값을 설정하고 `docker compose up -d`를 **최초 실행**하면, Docker의 공식 `postgres` 이미지가 아래 작업을 자동으로 수행합니다.

```
docker compose up -d
        ↓
볼륨이 비어있음을 감지 (최초 실행)
        ↓
docker-entrypoint.sh 실행
        ↓
내부적으로 아래 SQL과 동일한 효과 실행 (설명용 의사코드):
  CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}' SUPERUSER;
  CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
```

**주의: 최초 실행 이후에는 `.env`를 변경해도 계정이 자동으로 바뀌지 않습니다.**
볼륨에 데이터가 이미 존재하면 초기화 스크립트를 건너뜁니다.
계정 정보를 변경하려면 볼륨을 삭제하고 다시 실행해야 합니다.

```bash
# 계정 정보 변경 시 — 볼륨 삭제 후 재생성
docker compose down -v
docker compose up -d
```

---

## 볼륨 설정 변경

### 현재 방식: Named Volume

현재 설정 방식으로, Docker가 볼륨을 내부적으로 관리합니다.

```yaml
# docker-compose.yml 기본 설정
volumes:
  - postgres_data:/var/lib/postgresql/data
```

- 데이터 위치: Docker 내부 (`docker volume inspect`로 확인 가능)
- 초기화: `docker compose down -v`

### 로컬 경로 마운트 안내 (필요 시)

데이터 파일을 프로젝트 폴더에서 직접 확인하거나 백업/마이그레이션이 필요한 경우 사용합니다.

```yaml
# docker-compose.yml 수정
services:
  postgres:
    volumes:
      - ./data/postgres:/var/lib/postgresql/data # named volume 대신 로컬 경로 지정
```

로컬 경로 방식 사용 시 `data/` 폴더가 생성되므로 `.gitignore`에 추가해야 합니다.

```bash
# 프로젝트 루트 .gitignore에 추가
echo "data/" >> .gitignore
```

|                | Named Volume             | 로컬 경로 마운트                 |
| -------------- | ------------------------ | -------------------------------- |
| 데이터 위치    | Docker 내부 관리         | 프로젝트 폴더 내 직접 확인       |
| 파일 직접 접근 | docker cp 필요           | Finder/탐색기에서 바로 확인      |
| 초기화 방법    | `docker compose down -v` | `rm -rf ./data`                  |
| 추가 설정      | 없음                     | `.gitignore`에 `data/` 추가 필요 |

---

## 일반적인 개발 워크플로우

```bash
# 작업 시작
docker compose up -d
cd backend && ./gradlew bootRun

# 작업 종료 (데이터 유지)
docker compose stop

# DB 초기화가 필요할 때 (볼륨까지 삭제)
docker compose down -v
docker compose up -d
```

---

## 시크릿 파일 관리

파일 기반 시크릿(API 키, 인증서 등)은 `backend/secrets/` 디렉토리에 보관합니다.
이 디렉토리는 `.gitignore`에 등록되어 있어 Git에 포함되지 않습니다.
(`.gitkeep` 파일만 예외적으로 추적되어 디렉토리 구조를 유지합니다.)

```bash
backend/secrets/
├── .gitkeep         # Git 추적용 (비어있음)
├── firebase.json    # 예시 — Git에 포함되지 않음
└── gcp-key.json     # 예시 — Git에 포함되지 않음
```

---

## Security 설정

`SecurityConfig.java`는 현재 **모든 엔드포인트를 허용**하는 최소 설정 상태입니다.
인증이 필요한 경우 `SecurityConfig.java`를 수정하여 점진적으로 보안 정책을 추가하세요.

```java
// 현재 설정 (모두 허용)
.authorizeHttpRequests(auth -> auth
    .anyRequest().permitAll()
)

// 인증 적용 예시
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/public/**").permitAll()
    .anyRequest().authenticated()
)
```
