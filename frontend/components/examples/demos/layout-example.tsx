"use client";

import { useMediaQuery } from "usehooks-ts";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import type { ComponentProps } from "react";

// react-resizable-panels 타입 호환을 위한 캐스팅
const PanelGroup = ResizablePanelGroup as React.ComponentType<ComponentProps<typeof ResizablePanelGroup> & { direction: "horizontal" | "vertical" }>;

export function LayoutExample() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">현재 화면:</p>
        <Badge variant={isMobile ? "destructive" : "secondary"}>
          {isMobile ? "모바일 (≤640px)" : "데스크톱 (>640px)"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        useMediaQuery 훅으로 화면 크기를 감지합니다. 브라우저 창 크기를 조절해보세요.
      </p>

      <div className="rounded-lg border overflow-hidden">
        <PanelGroup direction="horizontal" className="min-h-[200px]">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex h-full items-center justify-center p-4 bg-muted/30">
              <span className="text-sm text-muted-foreground font-medium">사이드바</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm text-muted-foreground font-medium">콘텐츠 영역</span>
            </div>
          </ResizablePanel>
        </PanelGroup>
      </div>
      <p className="text-xs text-muted-foreground">
        핸들을 드래그하여 패널 크기를 조절하세요 (ResizablePanelGroup).
      </p>
    </div>
  );
}
