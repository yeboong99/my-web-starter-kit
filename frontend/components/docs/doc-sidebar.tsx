"use client";

import { cn } from "@/lib/utils";

const sections = [
  { id: "getting-started", label: "시작하기" },
  { id: "structure", label: "프로젝트 구조" },
  { id: "architecture", label: "아키텍처" },
  { id: "commands", label: "주요 명령어" },
];

interface DocSidebarProps {
  activeSection?: string;
}

export function DocSidebar({ activeSection }: DocSidebarProps) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="flex flex-col gap-1">
      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">목차</p>
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={cn(
            "text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-foreground",
            activeSection === id ? "bg-accent font-medium" : "text-muted-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
