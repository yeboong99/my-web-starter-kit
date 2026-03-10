# 버튼 요소에 cursor: pointer 누락 수정

## Context

모달 및 프로젝트 전반의 버튼(X 닫기, 폼 제출, +/- 등)에 마우스를 올려도 포인터 커서로 변경되지 않는 문제.

**원인**: Tailwind CSS v4의 preflight는 `button` 요소에 `cursor: pointer`를 설정하지 않으며(의도적 설계), shadcn Button 컴포넌트(`buttonVariants`)에도 `cursor-pointer` 클래스가 없음.

## 수정 방안

### 파일: `frontend/components/ui/button.tsx`

`buttonVariants`의 기본 클래스 문자열에 `cursor-pointer`를 추가한다.

이 한 곳만 수정하면 프로젝트 전체의 모든 Button 인스턴스(모달 X 버튼, 폼 제출, +/- 버튼, 초기화, 텍스트 복사 등)에 자동 적용된다.

## 검증 방법

1. 프론트엔드 dev 서버 실행
2. 예제 페이지 접속 → 각 예제 모달 열기
3. 모달 X 버튼, 폼 제출 버튼, +/- 버튼, 초기화 버튼, 텍스트 복사 버튼 위에 마우스 올렸을 때 포인터 커서 표시 확인
4. 다른 페이지의 버튼들도 포인터 커서 표시 확인
