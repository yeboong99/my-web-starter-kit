# Playwright MCP를 활용한 웹 애플리케이션 오류 수집 및 해결

## Context
현재 프론트엔드에 4개의 변경된 파일이 있으며 (layout.tsx, example-modal.tsx, theme-toggle.tsx, button.tsx), 이 변경사항들이 오류를 유발할 수 있음. Docker 서비스가 현재 중지 상태이므로 먼저 실행 필요.

## 실행 계획

### Step 1: 환경 준비
- `make up`으로 Docker Compose 서비스 전체 빌드 및 실행
- 서비스 정상 기동 대기 (nginx, backend, frontend, postgres, redis)

### Step 2: Playwright MCP로 오류 수집
- `mcp__playwright__browser_navigate`로 `https://localhost/` 접속
- `mcp__playwright__browser_console_messages`로 콘솔 에러/경고 수집
- `mcp__playwright__browser_snapshot`으로 페이지 상태 확인
- 주요 페이지 순회: `/`, `/docs`, `/examples`, `/status`
- 각 페이지에서 콘솔 에러, 네트워크 에러, UI 렌더링 이슈 확인
- 인터랙션 테스트: 테마 토글, 모달 열기/닫기 등

### Step 3: 오류 원인 분석
- 수집된 에러 메시지 기반으로 관련 소스 코드 확인
- 변경된 파일들과의 연관성 분석

### Step 4: 오류 수정
- 분석된 원인에 따라 코드 수정
- 주요 수정 대상 파일:
  - `frontend/app/layout.tsx` (staged 변경)
  - `frontend/components/examples/example-modal.tsx`
  - `frontend/components/layout/theme-toggle.tsx`
  - `frontend/components/ui/button.tsx`

### Step 5: 재테스트
- Docker 재빌드 (`make up`)
- Playwright MCP로 동일 경로 재검증
- 오류가 남아있으면 Step 2부터 반복

## 검증 방법
- Playwright MCP로 모든 주요 페이지 (/, /docs, /examples, /status) 접속
- 콘솔 에러 0건 확인
- 네트워크 요청 실패 0건 확인
- 테마 토글, 모달 등 인터랙션 정상 동작 확인
