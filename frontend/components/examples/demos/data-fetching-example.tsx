"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

export function DataFetchingExample() {
  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["health-demo"],
    queryFn: fetchHealth,
    refetchInterval: 10000,
    retry: 1,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">react-query로 `/api/health` 폴링 (10초)</p>
        {isFetching && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
          <br />
          <span className="text-xs text-muted-foreground">백엔드가 실행 중인지 확인하세요.</span>
        </div>
      )}

      {data && (
        <div className="rounded-lg border bg-muted/30 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white hover:bg-green-600">연결됨</Badge>
            <span className="text-sm text-muted-foreground">백엔드 응답 성공</span>
          </div>
          <pre className="text-xs font-mono overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
          {dataUpdatedAt > 0 && (
            <p className="text-xs text-muted-foreground">
              마지막 업데이트: {new Date(dataUpdatedAt).toLocaleTimeString("ko-KR")}
            </p>
          )}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
        <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
        수동 새로고침
      </Button>
    </div>
  );
}
