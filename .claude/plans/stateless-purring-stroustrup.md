# GitHub MCP 서버 토큰 분리 및 연결 수정

## Context
GitHub MCP 서버가 `GITHUB_PERSONAL_ACCESS_TOKEN` 환경변수 미설정으로 연결 실패 중.
이전 작업에서 `.gitignore`에 `.mcp.json`을 추가하고 git 추적을 제거했으나,
사용자 의도는 `.mcp.json`은 git에 유지하되 토큰만 `.env`로 분리하는 것.

## 수정 사항

### 1. `.mcp.json` 롤백 및 환경변수 참조 적용
- `.gitignore`에서 `.mcp.json` 항목 제거
- `.mcp.json`을 다시 git 추적에 추가 (`git add .mcp.json`)
- `env`의 토큰 값을 `${GITHUB_PERSONAL_ACCESS_TOKEN}` 참조로 변경

```json
"env": {
  "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
}
```

### 2. `.env` 파일에 토큰 추가
- 프로젝트 루트 `.env`에 `GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...` 추가
- `.env`는 이미 `.gitignore`에 포함되어 있으므로 git 노출 없음

## 수정 파일
- `.mcp.json` — env 값을 `${GITHUB_PERSONAL_ACCESS_TOKEN}` 참조로 변경
- `.gitignore` — `.mcp.json` 항목 제거 (이전 작업 롤백)
- `.env` — `GITHUB_PERSONAL_ACCESS_TOKEN` 항목 추가

## 보안 참고
- 현재 하드코딩된 토큰이 git 히스토리에 남아있을 수 있으므로 토큰 재발급 권장
- `.env`는 `.gitignore` 첫 번째 항목으로 이미 관리 중

## 검증
- `/mcp` 명령으로 github 서버 연결 상태 확인
