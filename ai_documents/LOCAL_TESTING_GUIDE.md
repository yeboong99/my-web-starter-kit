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
# 전체 스택 빌드 및 실행
make up

# 캐시 없이 완전 재빌드 (이미지 캐시 손상 시 사용)
make up-clean
```

전체 스택(postgres, redis, backend, frontend, nginx)을 빌드하고 실행합니다.

---

## 테스트

### 접속 확인

`https://localhost` 접속 → SSL 경고 없이 랜딩 페이지 표시

| 경로 | 설명 |
|------|------|
| `https://localhost/` | 홈 페이지 |
| `https://localhost/docs` | 문서 페이지 |
| `https://localhost/examples` | 예제 페이지 |
| `https://localhost/status` | 서버 상태 페이지 |

### API 엔드포인트 테스트

**Health Check:**

```bash
curl -k https://localhost/api/health
```

기대 응답:

```json
{"success":true,"data":{"status":"ok"},"message":"서버가 정상 동작 중입니다"}
```

**Status Check (DB + Redis 연결 상태):**

```bash
curl -k https://localhost/api/status
```

기대 응답:

```json
{
  "success": true,
  "data": {
    "database": "connected",
    "redis": "connected",
    "uptime": "..."
  },
  "message": "OK"
}
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

## Makefile 명령어 요약

| 명령어 | 설명 |
|--------|------|
| `make certs` | mkcert로 로컬 SSL 인증서 생성 |
| `make up` | 전체 스택 빌드 및 실행 |
| `make up-clean` | 캐시 없이 전체 재빌드 후 실행 |
| `make down` | 전체 스택 중지 |
| `make logs` | 전체 서비스 로그 확인 |
| `make clean` | 컨테이너 + 볼륨 전체 삭제 |

---

## 트러블슈팅

### 포트 80/443 충돌

다른 서비스가 80 또는 443 포트를 사용 중인 경우:

```bash
# macOS - 점유 중인 프로세스 확인
sudo lsof -i :80
sudo lsof -i :443
```

### 인증서 오류

`certs/` 디렉토리가 비어 있거나 인증서 파일이 없는 경우:

```bash
make certs
```

### 이미지 캐시 문제

빌드 캐시가 손상되어 변경사항이 반영되지 않는 경우:

```bash
make up-clean
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
- curl 사용 시 `-k` 플래그로 로컬 자체 서명 인증서 경고를 무시합니다.
