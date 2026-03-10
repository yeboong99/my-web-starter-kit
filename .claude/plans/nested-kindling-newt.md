# 홈 페이지 기술 스택 카드 수정 계획

## Context

홈 페이지(`https://localhost`)의 기술 스택 섹션에서 Spring Boot 4 카드의 설명에 Java 버전이 **21**로 잘못 표시되고 있음. 실제 프로젝트는 **Java 17**을 사용. 추가로 TypeScript 명시, Docker Compose 카드 추가, 카드 hover 애니메이션 강화 요청.

---

## 수정 대상 파일

`frontend/components/home/tech-stack-grid.tsx`

---

## 변경 사항

### 1. 기술 스택 데이터 수정

`stack` 배열의 현재 값 → 수정:

| 카드 | 현재 | 수정 |
|------|------|------|
| Next.js 16 | desc: `App Router, SSR/SSG, React 19` | desc: `App Router, TypeScript, React 19` |
| Spring Boot 4 | desc: `Java 21, REST API, JPA` | desc: `Java 17, REST API, JPA` |

### 2. Docker Compose 카드 추가

```ts
{ name: "Docker Compose", desc: "멀티 컨테이너 오케스트레이션", icon: "🐳" }
```

- 7개 카드가 되므로 그리드 레이아웃 조정 불필요 (2열/3열 그리드에 자연스럽게 배치됨)

### 3. 카드 hover 애니메이션 강화

현재: `transition-shadow hover:shadow-md` (그림자만 변경)

수정: 호버 시 카드가 살짝 위로 떠오르고 스케일 확대 + 그림자 강화

```
className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
```

---

## 검증 방법

- `make up` 후 `https://localhost` 접속
- 기술 스택 섹션에서:
  - Spring Boot 4 카드 desc가 "Java 17"로 표시되는지 확인
  - Next.js 16 카드 desc에 "TypeScript"가 포함되는지 확인
  - Docker Compose 카드(🐳)가 새로 표시되는지 확인
  - 카드에 마우스 호버 시 위로 떠오르는 애니메이션이 동작하는지 확인
