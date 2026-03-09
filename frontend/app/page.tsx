"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkHealth() {
    setLoading(true);
    setHealthStatus(null);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthStatus(`✓ 백엔드 연결 성공: ${JSON.stringify(data)}`);
    } catch {
      setHealthStatus("✗ 백엔드 연결 실패 — 서버가 실행 중인지 확인하세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* 헤더 */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
            Spring Boot + Next.js
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Web Starter Kit
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            새 프로젝트를 빠르게 시작하기 위한 기반 구조입니다.
            아래 버튼으로 백엔드 연결 상태를 확인하세요.
          </p>
        </div>

        {/* Health Check */}
        <div className="flex flex-col gap-3">
          <Button onClick={checkHealth} disabled={loading} className="w-fit">
            {loading ? "확인 중..." : "백엔드 Health Check"}
          </Button>
          {healthStatus && (
            <p
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                healthStatus.startsWith("✓")
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {healthStatus}
            </p>
          )}
        </div>

        {/* 스택 정보 */}
        <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          {[
            { label: "Framework", value: "Spring Boot 4 + Next.js 16" },
            { label: "Database", value: "PostgreSQL 17" },
            { label: "Cache", value: "Redis 7" },
            { label: "UI", value: "Tailwind CSS + shadcn/ui" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{label}</span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</span>
            </div>
          ))}
        </div>

        {/* 시작 안내 */}
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          시작하려면 <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">README.md</code>를 참고하세요.
        </p>
      </main>
    </div>
  );
}
