"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

export function ConnectionTest() {
  const [result, setResult] = useState<{ ok: boolean; data: unknown; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function runTest() {
    setLoading(true);
    setResult(null);
    const start = Date.now();
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setResult({ ok: res.ok, data, ms: Date.now() - start });
    } catch (e) {
      setResult({ ok: false, data: String(e), ms: Date.now() - start });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button onClick={runTest} disabled={loading} size="sm" variant="outline">
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "테스트 중..." : "헬스체크 실행"}
        </Button>
        {result && (
          <Badge className={result.ok ? "bg-green-500 text-white" : undefined} variant={result.ok ? undefined : "destructive"}>
            {result.ok ? `성공 (${result.ms}ms)` : "실패"}
          </Badge>
        )}
      </div>
      {result && (
        <pre className="text-xs font-mono bg-muted rounded-lg p-3 overflow-x-auto">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
