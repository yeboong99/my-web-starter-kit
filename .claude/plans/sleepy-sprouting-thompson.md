# MCP 서버 추가 계획: GitHub + Memory

## Context

스타터킷의 개발 생산성을 높이기 위해 MCP 서버를 추가한다.
- **GitHub MCP**: PR/이슈 관리, 코드 검색 등 GitHub 워크플로우 통합
- **Memory MCP**: 영속적 지식 그래프로 프로젝트 컨텍스트 유지

## 수정 대상 파일

### 1. `.mcp.json` — MCP 서버 설정 추가

기존 4개 서버(context7, playwright, sequential-thinking, shadcn)에 2개 추가:

#### GitHub MCP (Docker 방식)
```json
"github": {
  "type": "stdio",
  "command": "docker",
  "args": [
    "run", "-i", "--rm",
    "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
    "ghcr.io/github/github-mcp-server"
  ],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_GITHUB_PAT>"
  }
}
```
- 토큰은 플레이스홀더로 설정 (사용자가 직접 교체)
- Docker가 실행 중이어야 동작

#### Memory MCP (npx 방식)
```json
"memory": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"],
  "env": {}
}
```

### 2. `.claude/settings.json` — 권한 설정 추가

`allow` 배열에 추가:
- `"mcp__github"`
- `"mcp__memory"`

## 검증 방법

1. Claude Code 재시작 후 `/mcp` 명령으로 6개 서버 모두 연결 확인
2. GitHub MCP: Docker 실행 상태에서 토큰 설정 후 동작 확인
3. Memory MCP: 엔티티 저장/조회 테스트
