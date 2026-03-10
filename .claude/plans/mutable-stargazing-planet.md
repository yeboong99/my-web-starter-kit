# 다크모드 토글 스위치 애니메이션 개선

## Context
이전 구현에서 스위치 형태의 토글은 완성되었으나, thumb 이동이 부드럽지 않고 순간적으로 위치가 변경되는 문제가 있습니다. 원인은 Tailwind CSS v4에서 `translate-x-*`가 CSS `translate` 속성을 사용하는데, `transition-transform`은 `transform` 속성만 전환하므로 애니메이션이 적용되지 않기 때문입니다.

## 수정 대상 파일
- `frontend/components/layout/theme-toggle.tsx` (28번째 줄)

## 변경 내용
thumb의 `<span>`에서 `transition-transform` → `transition-all`로 변경하여 `translate`, `background-color` 등 모든 속성이 부드럽게 전환되도록 합니다.

```diff
- transition-transform duration-300
+ transition-all duration-300
```

## 검증 방법
1. `cd frontend && pnpm dev`로 개발 서버 실행
2. 토글 클릭 시 thumb이 좌↔우로 **부드럽게 슬라이드**되는지 확인
3. thumb 배경색(흰↔검정)도 부드럽게 전환되는지 확인
