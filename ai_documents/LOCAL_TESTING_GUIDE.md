# 로컬 개발 실행 및 테스트 가이드

## 로컬 개발 실행 방법

### 사전 준비

1. 루트 `.env` 파일이 없으면 생성한다.

```bash
cp .env.default .env
```

2. 인프라(PostgreSQL + Redis) 컨테이너를 기동한다.

```bash
make infra-up
# 또는: docker compose up -d
```

### 백엔드 실행

```bash
make dev-backend
# 또는: cd backend && ./gradlew bootRun
```

정상 기동 확인: `Started DemoApplication in X seconds` 메시지 출력.

### 프론트엔드 실행

```bash
make dev-frontend
# 또는: cd frontend && pnpm dev
```

`http://localhost:3000` 접속 후 랜딩 페이지가 표시되면 정상.

---

## 로컬 개발 테스트 방법

### 백엔드 단독 테스트

```bash
# Health Check 엔드포인트 응답 확인
curl http://localhost:8080/api/health
# 기대 응답: {"status":"ok"}
```

### 프론트엔드 → 백엔드 연결 테스트

1. 백엔드와 프론트엔드를 모두 실행한 상태에서 `http://localhost:3000` 접속
2. **"백엔드 Health Check"** 버튼 클릭
3. `✓ 백엔드 연결 성공: {"status":"ok"}` 메시지가 표시되면 정상

버튼 클릭 시 프론트엔드의 `/api/health` 요청이 `next.config.ts` rewrites를 통해 백엔드 `http://localhost:8080/api/health`로 프록시된다.

### 작업 종료

```bash
# 컨테이너 중지 (데이터 유지)
make infra-down

# 컨테이너 + 볼륨 전체 삭제 (DB 초기화 필요할 때)
make clean
```

---

## 주의사항

- `make` 명령어는 루트에 `.env` 파일이 있어야 동작한다.
- 백엔드 실행 전 반드시 `make infra-up`으로 DB/Redis를 먼저 띄워야 한다.
- 로컬 PostgreSQL이 5432 포트로 실행 중인 경우 Docker는 5433 포트를 사용한다 (충돌 방지).
