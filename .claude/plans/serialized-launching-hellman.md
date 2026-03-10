# Docs 페이지 최신화 계획

## Context

Docs 페이지(`/docs`)의 문서 내용이 실제 프로젝트 현재 상태와 일부 불일치하며, 백엔드 구조와 DB 설정 안내 섹션이 부족합니다. 섹션 순서 재배치, 명령어 복사 기능 추가도 함께 진행합니다.

## 수정 대상 파일

1. `frontend/components/docs/copyable-code.tsx` — **신규 생성**, 인라인 명령어 복사 버튼 컴포넌트
2. `frontend/app/(main)/docs/page.tsx` — 문서 콘텐츠 수정, 신규 섹션 추가, 섹션 순서 변경
3. `frontend/components/docs/doc-sidebar.tsx` — 사이드바 섹션 순서 변경 및 항목 추가

## 변경 사항

### 1. 인라인 명령어 복사 컴포넌트 생성 (`copyable-code.tsx`)

테이블 셀 안의 명령어에 복사 버튼을 제공하는 클라이언트 컴포넌트를 생성합니다.
기존 `CodeBlock`의 복사 로직(`usehooks-ts`의 `useCopyToClipboard`, `sonner` toast)을 재사용합니다.

```tsx
// 작은 인라인 코드 + 복사 아이콘 버튼
// 기존 code 스타일(bg-muted px-2 py-1 rounded font-mono text-xs)에 Copy 아이콘 추가
```

### 2. 섹션 순서 변경 (page.tsx)

**기존 순서:** 시작하기 → 프로젝트 구조 → 아키텍처 → 주요 명령어

**변경 순서:**
1. 시작하기 (`#getting-started`)
2. 아키텍처 (`#architecture`)
3. 프로젝트 구조 (`#structure`)
4. 백엔드 구조 (`#backend-structure`) — 신규
5. 주요 명령어 (`#commands`)
6. 데이터베이스 (`#database`) — 신규

### 3. 사이드바 순서 변경 및 항목 추가 (doc-sidebar.tsx)

```tsx
const sections = [
  { id: "getting-started", label: "시작하기" },
  { id: "architecture", label: "아키텍처" },
  { id: "structure", label: "프로젝트 구조" },
  { id: "backend-structure", label: "백엔드 구조" },
  { id: "commands", label: "주요 명령어" },
  { id: "database", label: "데이터베이스" },
];
```

### 4. 기존 섹션 최신화

**주요 명령어 테이블:**
- `make up-clean` 행 추가 ("캐시 없이 전체 스택 빌드 + 실행")
- 각 명령어에 `CopyableCode` 컴포넌트 적용하여 복사 버튼 제공

**프로젝트 구조 트리:**
- `ai_documents/` (#AI 참조 문서) 추가
- `.env.default` (#환경변수 템플릿) 추가

### 5. 신규 섹션: 백엔드 구조 (`#backend-structure`)

아키텍처 섹션 뒤, 주요 명령어 섹션 앞에 배치.

**패키지 구조** (CodeBlock):
```
com.example.demo
├── DemoApplication.java
└── global/
    ├── config/
    │   └── SecurityConfig.java       # CORS + Security 설정
    ├── controller/
    │   ├── HealthController.java     # GET /api/health
    │   └── StatusController.java     # GET /api/status
    ├── dto/
    │   └── ApiResponse.java          # 공통 응답 형식 (Record)
    └── exception/
        ├── code/
        │   ├── ErrorCode.java        # 에러 코드 인터페이스
        │   └── CommonErrorCode.java  # 공통 에러 코드 enum
        ├── custom/                   # 커스텀 예외 클래스
        └── handler/
            └── GlobalExceptionHandler.java
```

**공통 응답 형식** (테이블):

| 메서드 | 용도 |
|--------|------|
| `ApiResponse.ok(data)` | 성공 응답 (data 포함) |
| `ApiResponse.ok()` | 성공 응답 (data 없음) |
| `ApiResponse.error(message, code)` | 에러 응답 |

### 6. 신규 섹션: 데이터베이스 (`#database`)

주요 명령어 섹션 뒤에 배치.

**기본 접속 정보** (테이블):

| 항목 | 기본값 |
|------|--------|
| 호스트 | postgres (Docker 내부) |
| 포트 | 5432 |
| 데이터베이스 | demo |
| 사용자 | demo |
| 비밀번호 | demo1234 |

안내 텍스트: 접속 정보는 `.env` 파일에서 변경할 수 있습니다.

**컨테이너 접속** (CodeBlock, 복사 가능):
```bash
docker exec -it demo-postgres psql -U demo -d demo
```

**접속 정보 변경 시** — `.env` 파일 수정 후 볼륨 삭제 및 재시작 필요 (CodeBlock):
```bash
make clean && make up
```

**외부 DB 툴 접속** — 현재 PostgreSQL 포트가 외부 노출되지 않으므로 `docker-compose.yml`의 postgres 서비스에 포트 매핑 추가 필요 (CodeBlock):
```yaml
ports:
  - "5432:5432"
```

**JPA 스키마 관리** — `ddl-auto: update` 설정으로 엔티티 추가 시 테이블 자동 생성됨을 안내

## 검증 방법

1. `make up`으로 전체 스택 실행
2. `https://localhost/docs` 접속
3. 섹션 순서 확인: 시작하기 → 아키텍처 → 프로젝트 구조 → 백엔드 구조 → 주요 명령어 → 데이터베이스
4. 사이드바 목차 순서 및 6개 항목 확인
5. 주요 명령어 테이블에서 각 명령어 옆 복사 버튼 클릭 → 클립보드 복사 + toast 표시 확인
6. 프로젝트 구조 트리에 `ai_documents/`, `.env.default` 표시 확인
7. 백엔드 구조 섹션 패키지 트리, 응답 형식 테이블 확인
8. 데이터베이스 섹션 접속 정보, 명령어 CodeBlock 복사 버튼 동작 확인
