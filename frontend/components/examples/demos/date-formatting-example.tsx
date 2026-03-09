"use client";

import { useState } from "react";
import {
  format,
  formatDistanceToNow,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DateFormattingExample() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">기준 날짜</p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setDate(subDays(date, 1))}>-1일</Button>
          <span className="text-sm font-mono bg-muted px-3 py-1.5 rounded">
            {format(date, "yyyy-MM-dd")}
          </span>
          <Button size="sm" variant="outline" onClick={() => setDate(addDays(date, 1))}>+1일</Button>
          <Button size="sm" variant="ghost" onClick={() => setDate(new Date())}>오늘</Button>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">format() — 날짜 포맷</p>
        <div className="grid grid-cols-1 gap-1.5 text-sm font-mono">
          {[
            ["yyyy-MM-dd", format(date, "yyyy-MM-dd")],
            ["yyyy년 MM월 dd일", format(date, "yyyy년 MM월 dd일", { locale: ko })],
            ["PPP (한국어)", format(date, "PPP", { locale: ko })],
            ["EEEE (요일)", format(date, "EEEE", { locale: ko })],
            ["HH:mm:ss", format(date, "HH:mm:ss")],
          ].map(([pattern, result]) => (
            <div key={pattern} className="flex justify-between gap-4 rounded bg-muted px-3 py-1.5">
              <span className="text-muted-foreground">{pattern}</span>
              <span className="text-primary font-medium">{result}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">formatDistanceToNow() — 상대 시간</p>
        <div className="text-sm bg-muted px-3 py-2 rounded font-mono">
          {formatDistanceToNow(date, { addSuffix: true, locale: ko })}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">월 범위</p>
        <div className="text-sm bg-muted px-3 py-2 rounded font-mono flex flex-col gap-1">
          <span>시작: {format(startOfMonth(date), "yyyy-MM-dd")}</span>
          <span>끝: {format(endOfMonth(date), "yyyy-MM-dd")}</span>
        </div>
      </div>
    </div>
  );
}
