# 로컬 개발 실행 및 테스트 가이드

모든 서비스는 Docker Compose로 실행됩니다. 네이티브 실행(gradlew bootRun, pnpm dev)은 사용하지 않습니다.

---

## 사전 요구사항

- Docker Desktop 실행 중
- [mkcert](https://github.com/FiloSottile/mkcert) 설치됨

---

## 초기 설정 (최초 1회)

### 1. 환경변수 파일 생성

```bash
cp .env.default .env
```

### 2. 로컬 SSL 인증서 생성

```bash
# 로컬 CA를 시스템 인증서 저장소에 등록 (관리자 권한 필요)
mkcert -install

# certs/ 디렉토리에 localhost 인증서 생성
make certs
```

---

## 실행

```bash
make up
```

전체 스택(postgres, redis, backend, frontend, nginx)을 빌드하고 실행합니다.

---

## 테스트

### 접속 확인

`https://localhost` 접속 → SSL 경고 없이 랜딩 페이지 표시

### Health Check

브라우저에서 **Health Check** 버튼 클릭:
- `https://localhost/api/health` → nginx → `http://backend:8080/api/health`
- 기대 응답: `{"status":"ok"}`

또는 curl로 직접 테스트:

```bash
curl https://localhost/api/health
```

### 로그 확인

```bash
make logs
```

특정 서비스 로그만 보려면:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

---

## 종료

```bash
# 중지 (데이터 유지)
make down

# 볼륨까지 삭제 (DB 초기화)
make clean
```

---

## 트러블슈팅

### 포트 80/443 충돌

다른 서비스가 80 또는 443 포트를 사용 중인 경우:

```bash
# 점유 중인 프로세스 확인 (Windows)
netstat -ano | findstr :80
netstat -ano | findstr :443
```

### 인증서 오류

`certs/` 디렉토리가 비어 있거나 인증서 파일이 없는 경우:

```bash
make certs
```

### DB 초기화 필요

```bash
make clean
make up
```

---

## 주의사항

- `make` 명령어는 루트에 `.env` 파일이 있어야 동작합니다.
- `certs/` 디렉토리는 `.gitignore` 처리되어 각 개발자가 직접 생성해야 합니다.
- nginx가 API 라우팅 전담 (`/api/*` → backend). Next.js rewrite 없음.
