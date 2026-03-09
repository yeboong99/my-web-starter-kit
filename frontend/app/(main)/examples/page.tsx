"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ExampleCard } from "@/components/examples/example-card";
import { ExampleModal } from "@/components/examples/example-modal";
import { ComponentShowcase } from "@/components/examples/demos/component-showcase";
import { FormExample } from "@/components/examples/demos/form-example";
import { LayoutExample } from "@/components/examples/demos/layout-example";
import { DataFetchingExample } from "@/components/examples/demos/data-fetching-example";
import { HooksExample } from "@/components/examples/demos/hooks-example";
import { DateFormattingExample } from "@/components/examples/demos/date-formatting-example";
import { ServerClientExample } from "@/components/examples/demos/server-client-example";

const examples = [
  {
    id: "components",
    title: "컴포넌트 쇼케이스",
    description: "Button, Badge, Alert, Avatar, Tooltip, Progress, Skeleton 등 shadcn/ui 기본 컴포넌트 모음.",
    category: "UI",
    demo: <ComponentShowcase />,
    code: `import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
      </div>
      <Progress value={60} />
    </div>
  );
}`,
  },
  {
    id: "form",
    title: "폼 예제",
    description: "react-hook-form + zod로 유효성 검사를 포함한 완전한 폼 구현.",
    category: "폼",
    demo: <FormExample />,
    code: `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
  email: z.string().email("올바른 이메일 주소를 입력하세요."),
});

type FormValues = z.infer<typeof schema>;

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      <button type="submit">제출</button>
    </form>
  );
}`,
  },
  {
    id: "layout",
    title: "레이아웃 예제",
    description: "ResizablePanel로 크기 조절 가능한 패널 레이아웃 + useMediaQuery 반응형 감지.",
    category: "레이아웃",
    demo: <LayoutExample />,
    code: `import { useMediaQuery } from "usehooks-ts";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export function LayoutExample() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30}>
        <div>사이드바</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <div>콘텐츠</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}`,
  },
  {
    id: "data",
    title: "데이터 패칭",
    description: "react-query로 /api/health 폴링. 로딩/에러/성공 상태 자동 관리.",
    category: "데이터",
    demo: <DataFetchingExample />,
    code: `import { useQuery } from "@tanstack/react-query";

async function fetchHealth() {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

export function HealthStatus() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 10000,
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>연결 실패</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`,
  },
  {
    id: "hooks",
    title: "커스텀 훅",
    description: "usehooks-ts: useLocalStorage(영속성), useDebounceValue(검색), useCopyToClipboard.",
    category: "훅",
    demo: <HooksExample />,
    code: `import { useState } from "react";
import { useLocalStorage, useDebounceValue, useCopyToClipboard } from "usehooks-ts";

export function HooksDemo() {
  // localStorage에 영속적으로 저장
  const [count, setCount] = useLocalStorage("counter", 0);

  // 400ms 디바운스
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 400);

  // 클립보드 복사
  const [, copy] = useCopyToClipboard();

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>카운트: {count}</button>
      <input onChange={(e) => setSearch(e.target.value)} />
      <p>디바운스: {debouncedSearch}</p>
      <button onClick={() => copy("복사!")}>복사</button>
    </div>
  );
}`,
  },
  {
    id: "dates",
    title: "날짜 포맷팅",
    description: "date-fns로 날짜 포맷, 상대 시간 표현, 로케일(한국어) 적용.",
    category: "유틸",
    demo: <DateFormattingExample />,
    code: `import { format, formatDistanceToNow, addDays } from "date-fns";
import { ko } from "date-fns/locale";

const date = new Date();

// 날짜 포맷
format(date, "yyyy-MM-dd");                            // "2026-03-09"
format(date, "PPP", { locale: ko });                   // "2026년 3월 9일"
format(date, "EEEE", { locale: ko });                  // "월요일"

// 상대 시간
formatDistanceToNow(date, { addSuffix: true, locale: ko }); // "방금 전"

// 날짜 계산
addDays(date, 7);   // 7일 후
`,
  },
  {
    id: "server-client",
    title: "서버 vs 클라이언트",
    description: "서버 컴포넌트(타임스탬프)와 클라이언트 컴포넌트(카운터)의 차이점 비교.",
    category: "패턴",
    demo: <ServerClientExample serverTime={new Date().toLocaleString("ko-KR")} />,
    code: `// ServerComponent.tsx — "use server" 불필요, 기본값이 서버
export async function ServerComponent() {
  // DB 직접 접근, fs 읽기 등 가능
  const time = new Date().toLocaleString("ko-KR");
  return <p>서버 렌더링 시각: {time}</p>;
}

// ClientComponent.tsx — 반드시 "use client" 선언
"use client";
import { useState } from "react";

export function ClientComponent() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭: {count}
    </button>
  );
}`,
  },
];

export default function ExamplesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = examples.find((e) => e.id === selectedId);

  return (
    <>
      <PageHeader
        title="예제 갤러리"
        description="스타터킷에 포함된 라이브러리와 컴포넌트 사용 예제입니다."
        crumbs={[{ label: "Examples" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example) => (
          <ExampleCard
            key={example.id}
            title={example.title}
            description={example.description}
            category={example.category}
            onClick={() => setSelectedId(example.id)}
          />
        ))}
      </div>

      {selected && (
        <ExampleModal
          open={!!selectedId}
          onOpenChange={(open) => !open && setSelectedId(null)}
          title={selected.title}
          description={selected.description}
          demo={selected.demo}
          code={selected.code}
        />
      )}
    </>
  );
}
