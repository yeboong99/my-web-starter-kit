# Fix: VSCode 터미널에서 Shift+Enter 줄바꿈 안 되는 문제

## Context
사용자가 `/terminal-setup` 실행 후 VSCode 통합 터미널에서 Shift+Enter 줄바꿈이 작동하지 않음. 독립 Git Bash에서는 정상 작동.

## 원인
`C:\Users\Administrator\AppData\Roaming\Code\User\keybindings.json`에서 Shift+Enter가 `\u001b\r` (ESC + CR)을 전송하도록 설정되어 있음. 이 시퀀스는 bash readline에서 줄바꿈으로 해석되지 않음.

## 수정 사항

### 파일: `C:\Users\Administrator\AppData\Roaming\Code\User\keybindings.json`
- `"text": "\u001b\r"` → `"text": "\n"`으로 변경

## 검증
1. VSCode 재시작 (또는 터미널 탭 새로 열기)
2. Claude Code 실행
3. Shift+Enter로 줄바꿈 확인
