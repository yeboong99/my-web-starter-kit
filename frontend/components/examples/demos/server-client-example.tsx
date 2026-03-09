"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ServerClientExampleProps {
  serverTime: string;
}

function ClientCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge>Client Component</Badge>
        <span className="text-xs text-muted-foreground">use client — 인터랙티브</span>
      </div>
      <p className="text-sm text-muted-foreground">
        클라이언트 컴포넌트는 useState, useEffect 등을 사용할 수 있습니다.
        버튼 클릭이나 폼 입력 같은 인터랙션을 처리합니다.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setCount(count - 1)}>-</Button>
        <span className="text-xl font-bold w-8 text-center">{count}</span>
        <Button variant="outline" size="sm" onClick={() => setCount(count + 1)}>+</Button>
      </div>
    </div>
  );
}

export function ServerClientExample({ serverTime }: ServerClientExampleProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Server Component</Badge>
          <span className="text-xs text-muted-foreground">서버에서 렌더링됨</span>
        </div>
        <p className="text-sm text-muted-foreground">
          서버 컴포넌트는 데이터베이스 직접 접근, 파일 시스템 읽기 등이 가능합니다.
          클라이언트로 JS를 전송하지 않아 번들 크기가 줄어듭니다.
        </p>
        <div className="rounded-md bg-muted px-3 py-2 text-sm font-mono">
          서버 렌더링 시각: <span className="text-primary">{serverTime}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          * 새로고침 시 시각이 업데이트됩니다. 클릭으로는 변하지 않습니다.
        </p>
      </div>

      <Separator />

      <ClientCounter />
    </div>
  );
}
