"use client";

import { useState } from "react";
import { useLocalStorage, useDebounceValue, useCopyToClipboard } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

export function HooksExample() {
  const [count, setCount] = useLocalStorage("demo-counter", 0);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 400);
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copy("usehooks-ts는 정말 유용합니다!");
    setCopied(true);
    toast.success("복사됐습니다!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">useLocalStorage — 카운터 (새로고침 후에도 유지)</p>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setCount(count - 1)}>-</Button>
          <span className="text-2xl font-bold w-12 text-center">{count}</span>
          <Button variant="outline" size="sm" onClick={() => setCount(count + 1)}>+</Button>
          <Button variant="ghost" size="sm" onClick={() => setCount(0)}>초기화</Button>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">useDebounceValue — 400ms 디바운스</p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="search">검색어 입력</Label>
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="타이핑하면 400ms 후 반영..."
          />
        </div>
        <div className="rounded-md bg-muted px-3 py-2 text-sm font-mono">
          즉시: <span className="text-primary">{search || "(없음)"}</span>
          <br />
          디바운스: <span className="text-green-600 dark:text-green-400">{debouncedSearch || "(없음)"}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">useCopyToClipboard</p>
        <Button variant="outline" size="sm" className="w-fit gap-2" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "복사됨!" : "텍스트 복사"}
        </Button>
      </div>
    </div>
  );
}
