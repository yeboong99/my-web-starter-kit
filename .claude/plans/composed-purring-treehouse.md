# 프론트엔드 유틸리티 및 라이브러리 점검 & 업그레이드 플랜

## Context

프론트엔드 스타터킷의 유틸리티, 커스텀 훅, 외부 라이브러리를 전수 조사한 결과:
- **커스텀 훅**: 직접 구현한 것 없음. 모든 훅은 검증된 외부 라이브러리 사용 중
- **보안 취약점**: `pnpm audit` 결과 **없음**
- **업데이트 필요**: react 패치, zod v4 메이저, eslint v10 메이저, shadcn 위치 수정

---

## 수정 대상 파일

1. `frontend/package.json` - 버전 업데이트 + shadcn 이동
2. `frontend/components/examples/demos/form-example.tsx` - zod v4 대응 (필요시)
3. `frontend/eslint.config.mjs` - eslint v10 호환 확인 (현재 flat config이므로 변경 불필요할 가능성 높음)

---

## 실행 계획

### Step 1: package.json 수정

`frontend/package.json`에서 다음 변경:

```diff
 "dependencies": {
-    "react": "19.2.3",
-    "react-dom": "19.2.3",
-    "shadcn": "^4.0.2",
-    "zod": "^3.25.76"
+    "react": "19.2.4",
+    "react-dom": "19.2.4",
+    "zod": "^4.3.6"
 },
 "devDependencies": {
-    "@types/node": "^20",
-    "eslint": "^9",
+    "@types/node": "^22",
+    "eslint": "^10",
+    "shadcn": "^4.0.2",
 }
```

> `@types/node`는 ^22로 설정 (Docker에서 Node 20+ 사용, 타입 호환성 확보)

### Step 2: zod v4 마이그레이션

`frontend/components/examples/demos/form-example.tsx` 수정:

```diff
- import { z } from "zod";
+ import { z } from "zod/v4";
```

현재 사용 중인 zod API(`z.object`, `z.string().min()`, `.email()`, `z.boolean().refine()`, `z.infer`)는 zod v4에서도 호환됩니다. import 경로만 변경하면 됩니다.

> zod v4는 `zod/v4` 서브패스를 통한 점진적 마이그레이션을 지원합니다.

### Step 3: pnpm install & 빌드 검증

```bash
cd frontend
pnpm install
pnpm build
pnpm lint
```

### Step 4: ESLint v10 호환성 확인

현재 `eslint.config.mjs`는 이미 flat config 형식(`defineConfig`, `globalIgnores` from `eslint/config`)을 사용 중이므로 ESLint v10과 호환될 가능성이 높습니다. 빌드/린트 실행 후 문제가 있으면 대응합니다.

주의: `eslint-config-next` 16.1.6이 eslint v10과 호환되는지 실제 설치 후 확인 필요. 비호환 시 `eslint-config-next`도 최신 버전으로 업데이트합니다.

---

## 검증 방법

1. `pnpm install` - 의존성 설치 성공 확인
2. `pnpm build` - 빌드 성공, 타입 에러 없음 확인
3. `pnpm lint` - ESLint v10 정상 동작 확인
4. Docker Compose 실행 후 `/examples` 페이지에서 Form 데모, Hooks 데모 정상 동작 확인
