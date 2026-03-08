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

### 환경변수 관리

- [x] `.env` 생성 (Git 제외) — 실제 환경변수 값 보관
- [x] `.env.default` 생성 (Git 포함) — 템플릿 파일, 새 개발자 온보딩용
- [x] 루트 `.gitignore` 생성 — `.env` 제외 처리

### Spring Boot 설정

- [x] `backend/src/main/resources/application.yml` 수정
  - PostgreSQL DataSource 환경변수 참조 (`${VAR:기본값}` 문법 — Spring Boot 전용)
  - JPA Hibernate 설정 (ddl-auto: update, show-sql: true)
  - Redis 연결 설정
  - **주의**: Spring Boot는 `.env` 파일을 직접 읽지 않음. 환경변수 미설정 시 기본값 사용.

- [x] `backend/src/main/java/com/example/demo/config/SecurityConfig.java` 생성
  - 모든 엔드포인트 `permitAll`
  - CSRF 비활성화
  - 추후 인증 구현 시 점진적으로 수정하는 기반 구조

### 시크릿 관리

- [x] `backend/secrets/` 디렉토리 생성
  - `.gitkeep` 파일로 빈 디렉토리 Git 추적
  - `backend/.gitignore`에 `secrets/*` / `!secrets/.gitkeep` 추가

### 문서화

- [x] `README.md` 작성
  - 기술 스택, 프로젝트 구조
  - 5단계 설정 튜토리얼 (환경변수 → docker-compose → application.yml → 패키지명 변경 → 기동)
  - DB 계정 설정 원리 (최초 실행 시 자동 생성, 이후 변경 불가 주의사항)
  - 볼륨 설정 변경 안내 (Named Volume vs 로컬 경로 마운트)
  - 개발 워크플로우, 시크릿 관리, Security 설정 안내

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

### 우선 결정 필요 — `.env` 통합 전략

현재 `.env` 참조 구조가 미완성 상태입니다. 아래 내용을 먼저 결정하고 작업을 이어가야 합니다.

**현재 상황**
- 루트 `.env` → Docker Compose만 읽음 (자동)
- Spring Boot → `.env`를 직접 읽지 않음, `application.yml`의 기본값으로 동작 중
- 프론트엔드 → 미구성

**선택지**

| 방식 | 설명 | 적합한 경우 |
|---|---|---|
| 레이어별 `.env` 분리 | `backend/.env`, `frontend/.env` 각자 관리 | 구조 단순, 변수가 겹치지 않을 때 |
| Makefile + 루트 `.env` | `make dev` 등으로 통합 실행, 환경변수 자동 주입 | 팀 개발, 명령어 통일이 필요할 때 |
| dotenv-cli | 루트 `.env`를 읽어 하위 명령어에 주입 | Makefile 없이 간단히 해결하고 싶을 때 |
| 심볼릭 링크 | 루트 `.env`를 각 레이어에 링크 | 파일 하나로 공유하고 싶을 때 |

> **권장**: 스타터킷 규모에서는 **Makefile + 루트 `.env`** 방식이 가장 깔끔하게 통합 가능.
> 프론트엔드 스택이 결정되어야 프론트 쪽 `.env` 참조 방식도 확정 가능.

- [ ] **Makefile 도입 여부 결정 후 구현**

### 아직 손대지 않은 영역

- [ ] `frontend/` 디렉토리 — 현재 비어있음, 프론트엔드 스택 미결정
- [ ] Spring Security 인증 구현 — 현재 `permitAll` 상태
- [ ] API 응답 형식 표준화 (공통 응답 DTO 등)
- [ ] 테스트 환경 구성

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

> 새 프로젝트 시작 시 `.env`를 수정하고 `docker compose down -v && docker compose up -d`로 재생성.

---

## 다음 작업 시 참고사항

- 로컬에 PostgreSQL이 5432 포트로 실행 중이므로 Docker는 **5433** 사용 중
- `docker compose up -d` 후 `bootRun` 순서 지켜야 함
- 작업 재개 전 반드시 `docker compose up -d` 먼저 실행
