# MCP 연결 실패 수정 계획

## Context

`/mcp` 실행 시 `Failed to reconnect to context7.` 에러가 발생합니다.
원인은 `.mcp.json` 파일의 MCP 서버 실행 명령어가 **Windows 전용 형식**(`cmd /c npx`)으로 설정되어 있기 때문입니다.
현재 환경은 **macOS(Darwin)**이므로 `cmd` 명령어를 찾을 수 없어 연결이 실패합니다.

## 수정 대상

- **파일:** `/Users/yeboong99/Desktop/claude-code-mastery-web-starterkit/.mcp.json`

## 변경 내용

`command`를 `"cmd"`에서 `"npx"`로 변경하고, `args`에서 Windows 전용 인자(`"/c"`)를 제거합니다.

**Before:**
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@upstash/context7-mcp", "--api-key", "ctx7sk-..."]
    },
    "playwright": {
      "type": "stdio",
      "command": "cmd",
      "args": ["/c", "npx", "@playwright/mcp@latest"]
    }
  }
}
```

**After:**
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "ctx7sk-..."]
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

## 검증 방법

1. `.mcp.json` 수정 후 `/mcp` 명령어를 다시 실행하여 context7, playwright 서버가 정상 연결되는지 확인
