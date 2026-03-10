# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

Spring Boot 4 + Next.js 16 기반 풀스택 웹 애플리케이션 스타터킷.
Docker Compose로 모든 서비스(nginx, backend, frontend, PostgreSQL, Redis)를 통합 실행.

## 기술 스택

- **백엔드:** Java 17, Spring Boot 4.0.3, Spring Data JPA, Spring Security, Spring Session (Redis), Gradle
- **프론트엔드:** Next.js 16 (App Router, standalone), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, React Query v5, pnpm
- **인프라:** Docker Compose, nginx (리버스 프록시 + SSL), PostgreSQL 17, Redis 7, mkcert

## 아키텍처

```
브라우저 → nginx(443) → /api/* → backend:8080 / /* → frontend:3000
backend → PostgreSQL:5432, Redis:6379
외부 노출 포트: nginx 80, 443만
```

## 백엔드 구조

패키지: `com.example.demo`
- `global/config/` - SecurityConfig (CORS + Security, 현재 permitAll)
- `global/controller/` - HealthController (`/api/health`), StatusController (`/api/status`)
- `global/dto/` - ApiResponse<T> (Record 타입, 공통 응답 형식)
- `global/exception/` - ErrorCode 인터페이스, CommonErrorCode enum, BusinessException 계층, GlobalExceptionHandler
- 도메인 엔티티는 아직 없는 스타터킷 상태

## 프론트엔드 구조

- `app/(main)/` - Route Group: 홈(/), 문서(/docs), 예제(/examples), 상태(/status)
- `components/` - home, layout, status, docs, examples, ui(shadcn ~30개)
- `lib/` - api.ts (fetchHealth, fetchStatus), query-provider.tsx, utils.ts

## API 엔드포인트

- `GET /api/health` - 서버 상태 확인
- `GET /api/status` - DB, Redis 연결 상태 + 업타임

## 주요 설정 파일

- `docker-compose.yml` - 5개 서비스 오케스트레이션
- `nginx/default.conf` - SSL + 리버스 프록시
- `.env.default` - 환경변수 템플릿
- `Makefile` - 개발 명령어 (certs, up, down, logs, clean)
- `backend/src/main/resources/application.yml` - Spring Boot 설정
- `frontend/next.config.ts` - standalone 출력 모드

---

## 로컬 개발 실행 및 테스트

로컬 개발 환경 실행 방법과 테스트 방법은 `/ai_documents/LOCAL_TESTING_GUIDE.md`를 확인하세요.
