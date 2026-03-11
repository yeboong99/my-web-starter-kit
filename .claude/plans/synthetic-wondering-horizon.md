# Slack 알림 훅 개선: 프로젝트 스코프 Git 공유 + 중복 방지

> **상태: 구현 완료** (커밋 `9fc7fbe`)

## Context

이전 구현에서 프로젝트 스코프 훅을 `settings.local.json`에 등록했으나, 이 파일은 `.gitignore` 대상이라 팀원과 공유가 불가능합니다. 또한 절대 경로(`/Users/yeboong99/...`)를 사용하여 다른 팀원 환경에서 동작하지 않습니다.

**목표:** 프로젝트 스코프 훅을 `settings.json`(git-tracked)으로 이동하고, `$CLAUDE_PROJECT_DIR` 환경변수로 이식성 있는 경로를 사용합니다.

## 결정 사항

- `Stop` 훅, `SessionEnd` 훅 추가 불필요 → `Notification(idle_prompt)`로 작업 완료 알림 충분
- 현재 구성(Notification 3종: permission_prompt, idle_prompt, elicitation_dialog) 유지

## 변경 사항

### 1단계: 프로젝트에 `slack-notify.sh` 배치

- **파일**: `.claude/hooks/slack-notify.sh` (신규 생성)
- `~/.claude/hooks/slack-notify.sh`를 프로젝트로 복사 (프로젝트 스코프 전용)
- 팀원이 clone하면 바로 사용 가능

### 2단계: 프로젝트 `settings.json`에 hooks 등록

- **파일**: `.claude/settings.json` (기존 수정)
- `$CLAUDE_PROJECT_DIR` 환경변수로 이식성 있는 경로 사용

```json
"hooks": {
  "Notification": [
    {
      "matcher": "permission_prompt",
      "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/slack-notify.sh --source project", "timeout": 10 }]
    },
    {
      "matcher": "idle_prompt",
      "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/slack-notify.sh --source project", "timeout": 10 }]
    },
    {
      "matcher": "elicitation_dialog",
      "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/slack-notify.sh --source project", "timeout": 10 }]
    }
  ]
}
```

### 3단계: `settings.local.json`에서 hooks 제거

- **파일**: `.claude/settings.local.json` (수정)
- hooks 섹션 제거 → 원래 상태로 복원 (MCP 서버 + permissions만 유지)

### 4단계: 유저 스코프는 그대로 유지

- `~/.claude/settings.json` → `--source user` (이미 구현 완료, 변경 없음)
- `~/.claude/hooks/slack-notify.sh` → 유저 폴백용 (변경 없음)
- `~/.claude/.env` → 유저 글로벌 Webhook URL (변경 없음)

## 수정 대상 파일

| 파일 | 작업 | 비고 |
|------|------|------|
| `.claude/hooks/slack-notify.sh` | **신규 생성** | 프로젝트 스코프용 스크립트 (git-tracked) |
| `.claude/settings.json` | **수정** | hooks 섹션 추가 (`$CLAUDE_PROJECT_DIR` 경로) |
| `.claude/settings.local.json` | **수정** | hooks 섹션 제거 (원복) |

## 팀원 온보딩 플로우

1. `git clone` → `.claude/settings.json`에 hooks 자동 포함
2. `cp .env.default .env` → `SLACK_WEBHOOK_URL=` 본인 URL 입력
3. Claude Code 시작 → 알림 자동 동작

## 중복 방지 시나리오 (기존과 동일)

| 상황 | project 훅 | user 훅 | 알림 횟수 |
|------|-----------|---------|----------|
| 프로젝트 `.env`에 URL 있음 | 전송 | skip | **1회** |
| 프로젝트 `.env`에 URL 없음 | skip | `~/.claude/.env`에서 전송 | **1회** |
| 둘 다 URL 없음 | skip | skip | **0회** |

## 검증 방법

```bash
# 프로젝트 스코프 (프로젝트 .env에서 URL 읽기)
echo '{"session_id":"test-123","cwd":"'$(pwd)'","hook_event_name":"Notification","notification_type":"idle_prompt"}' | .claude/hooks/slack-notify.sh --source project

# 유저 스코프 skip 확인 (프로젝트 .env에 URL 있으면 skip)
echo '{"session_id":"test-123","cwd":"'$(pwd)'","hook_event_name":"Notification","notification_type":"idle_prompt"}' | ~/.claude/hooks/slack-notify.sh --source user
```
