"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBanner } from "@/components/status/status-banner";
import { StatusCard } from "@/components/status/status-card";
import { ConnectionTest } from "@/components/status/connection-test";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Server, Database, Zap, Globe } from "lucide-react";
import { fetchStatus } from "@/lib/api";

interface HealthData {
  status?: string;
  db?: string;
  redis?: string;
  uptime?: number;
  responseTime?: number;
}

export default function StatusPage() {
  const { data, isLoading, isError, dataUpdatedAt } = useQuery<HealthData>({
    queryKey: ["health-status"],
    queryFn: fetchStatus,
    refetchInterval: 5000,
    retry: 1,
  });

  const isApiUp = !isError && !!data;
  const isDbUp = isApiUp && data?.db !== "down";
  const isRedisUp = isApiUp && data?.redis !== "down";

  const systemStatus = isLoading
    ? "loading"
    : isError
    ? "down"
    : isDbUp && isRedisUp
    ? "operational"
    : "degraded";

  return (
    <>
      <PageHeader
        title="시스템 상태"
        description="실시간 서비스 상태를 모니터링합니다. 5초마다 자동 갱신됩니다."
        crumbs={[{ label: "Status" }]}
      />

      <div className="flex flex-col gap-6">
        <StatusBanner status={systemStatus} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatusCard
            title="Backend API"
            icon={Server}
            isLoading={isLoading}
            isUp={isError ? false : isApiUp}
            details={
              data
                ? {
                    "응답시간": data.responseTime ? `${data.responseTime}ms` : "—",
                    "업타임": data.uptime ? `${Math.floor(data.uptime / 60)}분` : "—",
                  }
                : undefined
            }
          />
          <StatusCard
            title="PostgreSQL"
            icon={Database}
            isLoading={isLoading}
            isUp={isError ? false : isDbUp ?? null}
            details={data ? { "연결": isDbUp ? "정상" : "장애" } : undefined}
          />
          <StatusCard
            title="Redis"
            icon={Zap}
            isLoading={isLoading}
            isUp={isError ? false : isRedisUp ?? null}
            details={data ? { "연결": isRedisUp ? "정상" : "장애" } : undefined}
          />
          <StatusCard
            title="Nginx"
            icon={Globe}
            isLoading={isLoading}
            isUp={!isError}
            details={{ "역할": "리버스 프록시 + SSL", "포트": "80, 443" }}
          />
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">수동 헬스체크</CardTitle>
          </CardHeader>
          <CardContent>
            <ConnectionTest />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">환경 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "NODE_ENV", value: process.env.NODE_ENV || "development" },
                { label: "API URL", value: process.env.NEXT_PUBLIC_API_URL || "(미설정)" },
                {
                  label: "마지막 갱신",
                  value: dataUpdatedAt
                    ? new Date(dataUpdatedAt).toLocaleTimeString("ko-KR")
                    : "—",
                },
                { label: "폴링 주기", value: "5초" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-mono font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
