"use client";

import { useCopyToClipboard } from "usehooks-ts";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copy(code);
    setCopied(true);
    toast.success("클립보드에 복사됐습니다.");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("relative rounded-lg border bg-muted/50 font-mono text-sm", className)}>
      {language && (
        <div className="px-4 py-1.5 text-xs text-muted-foreground border-b">{language}</div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7"
        onClick={handleCopy}
        aria-label="코드 복사"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      <pre className="overflow-x-auto p-4 pr-10">
        <code>{code}</code>
      </pre>
    </div>
  );
}
