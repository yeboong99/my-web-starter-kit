# direnv 설치 안내 문서화 계획

## Context

프로젝트에 `.envrc` 파일(내용: `dotenv`)이 존재하지만, 어떤 문서에도 direnv 설치/사용 안내가 없음.
새로운 머신에서 클론 후 direnv가 없으면 GitHub MCP 서버 등이 `GITHUB_PERSONAL_ACCESS_TOKEN` 환경변수를 인식하지 못함.
Claude Code 실행 시 자동으로 읽히는 CLAUDE.md에 안내를 추가하면 초기 설정 누락을 방지할 수 있음.

---

## 수정 대상 파일 (3개)

### 1. `CLAUDE.md` (프로젝트 루트, 67줄)

**수정 1 — "주요 설정 파일" 목록에 `.envrc` 추가 (54번째 줄 뒤)**
```
- `.envrc` - direnv 설정 (`.env` 파일 자동 로드)
```

**수정 2 — "로컬 개발 실행 및 테스트" 섹션 뒤에 direnv 안내 섹션 추가 (62번째 줄 뒤)**
```markdown
## direnv 설정 (권장)

이 프로젝트는 direnv를 사용하여 `.env` 파일의 환경변수를 셸에 자동 로드합니다.
MCP 서버(GitHub MCP 등)가 환경변수를 인식하려면 direnv 설정이 필요합니다.

1. direnv 설치
2. 셸 hook 설정 (예: `eval "$(direnv hook zsh)"` → `~/.zshrc`)
3. 프로젝트에서 `direnv allow` 실행
4. `.env` 파일 생성 (`cp .env.default .env` 후 값 설정)

상세 안내: `/ai_documents/LOCAL_TESTING_GUIDE.md` 참고.
```

---

### 2. `ai_documents/LOCAL_TESTING_GUIDE.md` (179줄)

**수정 1 — 사전 요구사항에 direnv 추가 (10번째 줄 뒤)**
```
- [direnv](https://direnv.net/) 설치됨 (권장 - MCP 서버 환경변수 자동 로드)
```

**수정 2 — "### 1. 환경변수 파일 생성" 다음에 새 단계 삽입 (21번째 줄 뒤)**

"### 2. direnv 설정 (권장)" 섹션 추가:
- direnv 설치 명령어 (macOS: brew, Ubuntu: apt, Windows: scoop/winget)
- 셸 hook 설정 (Bash, Zsh, PowerShell 각각)
- `direnv allow` 실행 안내

**수정 3 — 기존 "### 2. 로컬 SSL 인증서 생성" → "### 3. 로컬 SSL 인증서 생성"으로 번호 변경**

**수정 4 — 주의사항 섹션 끝에 추가 (178번째 줄 뒤)**
```
- `.envrc` 파일의 `dotenv` 설정으로 `.env` 파일을 자동 로드합니다. direnv가 없으면 MCP 서버가 환경변수를 인식하지 못할 수 있습니다.
```

---

### 3. `frontend/app/(main)/docs/page.tsx` (272줄)

**수정 1 — 사전 요구사항 배지 배열에 추가 (34번째 줄)**
```tsx
// 변경 전
{["Docker Desktop", "mkcert", "GNU Make", "pnpm (선택)"].map(...)
// 변경 후
{["Docker Desktop", "mkcert", "direnv (권장)", "GNU Make", "pnpm (선택)"].map(...)
```

**수정 2 — "초기 설정" 블록과 "로컬 HTTPS 인증서" 블록 사이에 direnv 안내 블록 삽입 (45~46번째 줄 사이)**
```tsx
<div className="flex flex-col gap-3">
  <p className="font-medium">direnv 설정 (권장)</p>
  <p className="text-muted-foreground text-xs">
    MCP 서버가 환경변수를 인식하려면 direnv가 필요합니다.
    설치 후 셸 hook을 설정하세요.
  </p>
  <CodeBlock code={`# 설치 (macOS)
brew install direnv

# 셸 hook 추가 (~/.zshrc)
eval "$(direnv hook zsh)"

# 프로젝트에서 활성화
direnv allow`} language="bash" />
</div>
```

---

## 검증 방법

1. `make up` 또는 프론트엔드 단독 실행 후 `https://localhost/docs` 접속 → "시작하기" 섹션에 direnv 배지와 안내 블록 표시 확인
2. CLAUDE.md에 direnv 섹션이 추가되었는지 확인 → 새 세션에서 Claude Code 실행 시 direnv 안내가 컨텍스트에 포함됨
3. LOCAL_TESTING_GUIDE.md의 단계 번호가 올바른지 확인 (1→2→3 순서)
