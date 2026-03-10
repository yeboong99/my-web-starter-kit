# 카드 호버 테두리 강조 효과 개선

## Context
이전 작업에서 모든 카드에 `hover:border-primary`를 적용했지만, Card 컴포넌트가 `border`가 아닌 `ring-1 ring-foreground/10`으로 외곽선을 표현하고 있어 hover 시 테두리 색상 변화가 거의 보이지 않음. 또한 `--primary` 색상이 무채색(chroma 0)이라 색조 차이도 없음.

**근본 원인:**
- Card의 외곽선: `ring-1 ring-foreground/10` (ring 사용, border 아님)
- `hover:border-primary`는 border 속성을 변경하지만 Card에 border-width가 없어 시각적 효과 없음
- `--primary` 색상이 라이트/다크 모두 무채색이라 색조 대비 부족

## 변경 사항

### 수정 대상 파일 3개

모든 카드에서 `hover:border-primary`를 **`hover:ring-primary/50`**으로 교체:
- `ring-primary/50`: primary 색상 50% 불투명도로 기본 `ring-foreground/10` 대비 확실한 차이
- 라이트 모드: 연한 회색 ring → 어두운 반투명 ring (대비 확보)
- 다크 모드: 희미한 흰색 ring → 밝은 반투명 ring (대비 확보)
- ring 기반이므로 기존 Card 스타일과 자연스럽게 호환

#### 1. `frontend/components/home/tech-stack-grid.tsx` (19번째 줄)
- 기존: `hover:border-primary`
- 변경: `hover:ring-primary/50`

#### 2. `frontend/components/home/feature-highlights.tsx` (35번째 줄)
- 기존: `hover:border-primary`
- 변경: `hover:ring-primary/50`

#### 3. `frontend/components/examples/example-card.tsx` (15번째 줄)
- 기존: `hover:border-primary`
- 변경: `hover:ring-primary/50`

## 검증 방법
- `cd frontend && pnpm dev`로 프론트엔드 실행
- 라이트 모드: 메인 페이지 기술 스택/주요 특징 카드, 예제 페이지 카드에 마우스 hover 시 테두리가 눈에 띄게 진해지는지 확인
- 다크 모드: 동일하게 hover 시 테두리 변화가 확실히 보이는지 확인
- `transition-all duration-300`이 이미 적용되어 있으므로 ring 색상도 자연스럽게 전환됨
