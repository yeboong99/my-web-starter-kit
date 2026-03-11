# 커밋 계획

## Context
커밋 슬래시 커맨드를 `.claude/commands/git/commit.md`로 재배치하고, CLAUDE.md에 스타터킷 안내를 추가하는 변경사항입니다.

## 변경사항
1. `.claude/commands/commit.md` 삭제 → `.claude/commands/git/commit.md`로 이동 (네임스페이스 정리)
2. `CLAUDE.md` - 스타터킷 상태 안내 섹션 추가 및 포맷 수정

## 실행 계획
1. 변경된 파일들을 staging:
   - `git add .claude/commands/commit.md` (삭제 반영)
   - `git add .claude/commands/git/commit.md` (새 위치)
   - `git add CLAUDE.md`
2. 커밋 메시지: `fix: CLAUDE.md 안내 추가`
