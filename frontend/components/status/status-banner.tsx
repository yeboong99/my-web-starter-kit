import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SystemStatus = "operational" | "degraded" | "down" | "loading";

interface StatusBannerProps {
  status: SystemStatus;
}

const config: Record<SystemStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  operational: {
    label: "All Systems Operational",
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50",
  },
  degraded: {
    label: "Partial System Degradation",
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/50",
  },
  down: {
    label: "System Outage",
    icon: XCircle,
    className: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50",
  },
  loading: {
    label: "상태 확인 중...",
    icon: AlertTriangle,
    className: "border-border bg-muted",
  },
};

export function StatusBanner({ status }: StatusBannerProps) {
  const { label, icon: Icon, className } = config[status];

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border px-6 py-4", className)}>
      <Icon className={cn("h-5 w-5",
        status === "operational" ? "text-green-600 dark:text-green-400" :
        status === "degraded" ? "text-yellow-600 dark:text-yellow-400" :
        status === "down" ? "text-red-600 dark:text-red-400" :
        "text-muted-foreground"
      )} />
      <span className="font-medium">{label}</span>
      {status === "operational" && (
        <Badge className="ml-auto bg-green-500 text-white hover:bg-green-600">정상</Badge>
      )}
      {status === "degraded" && (
        <Badge className="ml-auto bg-yellow-500 text-white hover:bg-yellow-600">주의</Badge>
      )}
      {status === "down" && (
        <Badge variant="destructive" className="ml-auto">장애</Badge>
      )}
    </div>
  );
}
