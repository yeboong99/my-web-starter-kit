import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  isLoading: boolean;
  isUp: boolean | null;
  details?: Record<string, string | number>;
}

export function StatusCard({ title, icon: Icon, isLoading, isUp, details }: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
        {isLoading ? (
          <Skeleton className="h-5 w-14" />
        ) : isUp === null ? (
          <Badge variant="secondary">미확인</Badge>
        ) : isUp ? (
          <Badge className="gap-1 bg-green-500 text-white hover:bg-green-600">
            <CheckCircle className="h-3 w-3" />
            정상
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            장애
          </Badge>
        )}
      </CardHeader>
      {details && (
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">{key}</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </CardContent>
      )}
    </Card>
  );
}
