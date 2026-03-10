include .env
export

.PHONY: up up-clean down logs clean certs

# 인증서 생성 (최초 1회, mkcert 설치 필요)
certs:
	mkdir -p certs
	mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost 127.0.0.1 ::1

# 전체 스택 실행
up:
	docker compose up --build -d

# 캐시 없이 전체 재빌드 후 실행 (캐시 손상 시 사용)
up-clean:
	docker compose build --no-cache && docker compose up -d

# 전체 스택 중지
down:
	docker compose down

# 로그 확인
logs:
	docker compose logs -f

# 전체 삭제 (볼륨 포함)
clean:
	docker compose down -v
