include .env
export

.PHONY: infra-up infra-down dev-backend dev-frontend clean

infra-up:
	docker compose up -d

infra-down:
	docker compose stop

dev-backend:
	cd backend && ./gradlew bootRun

dev-frontend:
	cd frontend && pnpm dev

clean:
	docker compose down -v
