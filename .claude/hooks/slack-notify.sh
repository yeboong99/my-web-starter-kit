#!/usr/bin/env bash
# Claude Code Notification Hook - Slack 알림 전송 스크립트
# stdin으로 JSON을 받아 notification_type에 따라 Slack 메시지를 전송합니다.
#
# 사용법: slack-notify.sh [--source user|project]
#   --source user    : ~/.claude/.env에서 URL 읽기 (프로젝트에 URL 있으면 skip)
#   --source project : $CWD/.env에서 URL 읽기

set -euo pipefail

# --source 인자 파싱 (기본값: user)
SOURCE="user"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --source)
      SOURCE="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# stdin JSON 읽기
INPUT=$(cat)

# jq로 필드 파싱
NOTIFICATION_TYPE=$(echo "$INPUT" | jq -r '.notification_type // empty')
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

# notification_type이 없으면 종료 (정상)
if [ -z "$NOTIFICATION_TYPE" ]; then
  exit 0
fi

# Webhook URL 결정 로직
WEBHOOK_URL=""

if [ "$SOURCE" = "project" ]; then
  # 프로젝트 스코프: $CWD/.env에서 URL 읽기
  if [ -n "$CWD" ] && [ -f "$CWD/.env" ]; then
    WEBHOOK_URL=$(grep -E '^SLACK_WEBHOOK_URL=' "$CWD/.env" 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
  fi
else
  # 유저 스코프: 프로젝트 .env에 URL이 이미 있으면 skip (프로젝트 훅이 처리)
  PROJECT_HAS_URL=""
  if [ -n "$CWD" ] && [ -f "$CWD/.env" ]; then
    PROJECT_HAS_URL=$(grep -E '^SLACK_WEBHOOK_URL=' "$CWD/.env" 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
  fi

  if [ -n "$PROJECT_HAS_URL" ]; then
    # 프로젝트에 URL이 있으므로 프로젝트 훅이 전송 → 중복 방지를 위해 skip
    exit 0
  fi

  # 프로젝트에 URL이 없으면 ~/.claude/.env에서 폴백
  USER_ENV="$HOME/.claude/.env"
  if [ -f "$USER_ENV" ]; then
    WEBHOOK_URL=$(grep -E '^SLACK_WEBHOOK_URL=' "$USER_ENV" 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
  fi
fi

# Webhook URL이 없으면 종료 (정상)
if [ -z "$WEBHOOK_URL" ]; then
  exit 0
fi

# 프로젝트명 추출 (cwd 마지막 디렉토리명)
PROJECT_NAME=$(basename "${CWD:-unknown}")

# 세션 ID 앞 8자
SESSION_SHORT="${SESSION_ID:0:8}"

# 현재 시각 (KST)
TIMESTAMP=$(TZ=Asia/Seoul date '+%Y-%m-%d %H:%M:%S KST')

# notification_type별 메시지 설정
case "$NOTIFICATION_TYPE" in
  permission_prompt)
    COLOR="#FF8C00"
    EMOJI="🔒"
    TITLE="권한 승인 요청"
    TEXT="Claude Code가 작업 진행을 위해 권한 승인을 기다리고 있습니다. 터미널을 확인해 주세요."
    ;;
  idle_prompt)
    COLOR="#36A64F"
    EMOJI="✅"
    TITLE="작업 완료"
    TEXT="Claude Code가 작업을 완료하고 다음 지시를 기다리고 있습니다."
    ;;
  elicitation_dialog)
    COLOR="#0078D4"
    EMOJI="🙋"
    TITLE="의사결정 필요"
    TEXT="Claude Code가 진행을 위해 추가 정보나 결정이 필요합니다. 터미널을 확인해 주세요."
    ;;
  *)
    exit 0
    ;;
esac

# Slack Block Kit JSON 페이로드 구성
PAYLOAD=$(jq -n \
  --arg color "$COLOR" \
  --arg emoji "$EMOJI" \
  --arg title "$TITLE" \
  --arg text "$TEXT" \
  --arg project "$PROJECT_NAME" \
  --arg timestamp "$TIMESTAMP" \
  --arg session "$SESSION_SHORT" \
  '{
    attachments: [
      {
        color: $color,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: ($emoji + " Claude Code - " + $title),
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: $text
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: ("*프로젝트:* " + $project + "  |  *시각:* " + $timestamp + "  |  *세션:* `" + $session + "`")
              }
            ]
          }
        ]
      }
    ]
  }')

# Slack으로 전송 (실패해도 exit 0 유지)
curl --silent --max-time 5 \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WEBHOOK_URL" || true

exit 0
