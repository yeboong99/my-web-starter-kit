# PROGRESS.md 업데이트 계획

## Context

스타터킷 프로젝트의 진행 현황 문서(PROGRESS.md)를 최신 상태로 업데이트한다. 최근 완료한 CLAUDE.md 가이드 분리 작업과 ai_documents 디렉토리 도입을 반영하고, 향후 진행할 작업 로드맵을 추가한다.

## 수정 대상 파일

| 파일 | 작업 |
|------|------|
| `PROGRESS.md` | 완료 항목 추가 + 다음 작업 로드맵 교체 |

## 상세 변경 내용

### 1. "완료된 작업" 섹션에 추가할 항목

"문서화" 하위에 다음 내용 추가:

- **AI 문서 구조 개선**
  - `ai_documents/` 디렉토리 신규 생성
  - `ai_documents/LOCAL_TESTING_GUIDE.md` 생성 — 로컬 개발 실행/테스트 가이드
  - `CLAUDE.md` 간소화 — 상세 내용을 `ai_documents/LOCAL_TESTING_GUIDE.md`로 분리, 참조 링크로 교체

### 2. "미완료 / 다음 작업 후보" 섹션 교체

기존 3개 항목을 유지하면서 다음 로드맵을 추가:

**Phase 1: 실행 및 검증**
- 로컬 개발 환경 전체 기동 테스트 (infra-up → backend → frontend)
- 프론트엔드 → 백엔드 Health Check 연결 검증
- Docker Compose 프로덕션 빌드 검증 (`docker-compose.prod.yml`)

**Phase 2: 스타터킷 웹페이지 구성 및 메인페이지 개선**
- 메인 페이지(`page.tsx`) 리디자인 — 스타터킷 소개, 기능 목록, 퀵스타트 가이드
- 공통 레이아웃 구성 — 네비게이션 바, 푸터
- 글로벌 스타일 및 테마 설정

**Phase 3: 예제 페이지 및 유틸리티 구성**
- 예제 페이지: CRUD 데모, 폼 처리, API 연동 예시 등
- 공통 유틸리티: API 클라이언트, 에러 핸들링, 공통 응답 DTO
- 백엔드 예제 API 엔드포인트 추가

## 검증

- PROGRESS.md에 최근 완료 작업(AI 문서 구조 개선)이 반영되어 있는지 확인
- 다음 작업 로드맵이 Phase 1~3으로 구조화되어 있는지 확인
