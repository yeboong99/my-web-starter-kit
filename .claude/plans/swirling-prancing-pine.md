# github-tag-action과 커밋 메시지 스코프 호환성 조사

## Context

`/git:commit` 커스텀 명령어로 생성된 커밋 메시지가 `refactor(global):` 형태로 스코프가 포함되었다.
`mathieudutour/github-tag-action@v6.2`에서 이 형식을 올바르게 파싱하는지 확인이 필요했다.

---

## 조사 결과

### github-tag-action의 내부 파싱 체인

```
@semantic-release/commit-analyzer (^8.0.1)
  → conventional-changelog-conventionalcommits (^4.6.1)
    → conventional-commits-parser
```

### 커밋 헤더 파싱 정규식 (`conventional-commits-parser` 기본값)

```regex
/^(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: (.*)$/
```

- **Group 1 (type)**: `\w*` → `refactor`
- **Group 2 (scope)**: `[\w\$\.\-\* ]*` → `global` (선택사항, 괄호 포함)
- **Group 3 (subject)**: `.*` → 설명

### 결론: `refactor(global):` 은 **정상 파싱된다**

- `(global)` 스코프는 정규식의 `(?:\(([\w\$\.\-\* ]*)\))?` 부분에 매칭
- `feat(auth):`, `fix(api):`, `refactor(service):` 등 모든 스코프 커밋이 동일하게 동작
- 타입(`refactor`)이 정확히 추출되므로 bump level 판단에 영향 없음

### 주의사항 (스코프 문자 제한)

스코프에 **한글이나 `/`, `@` 등 특수문자**가 들어가면 파싱 실패 가능.
허용 문자: 영문, 숫자, `_`, `$`, `.`, `-`, `*`, 공백

---

## `/git:commit` 명령어 수정 필요 여부: **불필요**

현재 커밋 명령어(`/.claude/commands/git/commit.md`)의 지시사항:
- 스코프는 이미 "선택사항"으로 명시됨 (규칙 4번)
- 예시에 `feat(auth):`, `refactor(service):` 등 스코프 포함 형태가 있음
- Conventional Commits 표준 규격을 따르고 있음

**→ github-tag-action과 완전 호환되므로 명령어 변경 불필요.**
