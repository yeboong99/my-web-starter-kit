"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { useState } from "react";

export function ComponentShowcase() {
  const [progress, setProgress] = useState(40);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Button variants</p>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Badge variants</p>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Alert</p>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>정보</AlertTitle>
          <AlertDescription>shadcn/ui Alert 컴포넌트 예제입니다.</AlertDescription>
        </Alert>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Avatar + Tooltip</p>
        <div className="flex gap-2">
          {["AB", "CD", "EF"].map((initials) => (
            <Tooltip key={initials}>
              <TooltipTrigger>
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>사용자 {initials}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Progress</p>
        <Progress value={progress} className="w-full" />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
          <Button size="sm" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Skeleton (로딩 플레이스홀더)</p>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
