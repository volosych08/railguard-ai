import { TrainRoute } from "@/lib/railguard/types";
import { Anomaly } from "@/lib/railguard/types";
import { Train, AlertTriangle, XCircle, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  routes: TrainRoute[];
  anomalies: Anomaly[];
}

export default function StatsBar({ routes, anomalies }: Props) {
  const criticals = anomalies.filter((a) => a.severity === "critical").length;
  const warnings = anomalies.filter((a) => a.severity === "warning").length;
  const delayed = routes.filter((r) => r.delay > 0).length;
  const onTime = routes.filter((r) => r.status === "on_time").length;

  const stats = [
    { label: "Active Trains", value: routes.length, icon: Train, color: "text-primary", bg: "bg-primary/10" },
    { label: "On Time", value: onTime, icon: Activity, color: "text-success", bg: "bg-success/10" },
    { label: "Delayed", value: delayed, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Critical", value: criticals, icon: XCircle, color: "text-danger", bg: "bg-danger/10" },
    { label: "Warnings", value: warnings, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border overflow-x-auto">
      {stats.map((s) => (
        <div key={s.label} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", s.bg)}>
          <s.icon className={cn("w-3.5 h-3.5", s.color)} />
          <span className={cn("text-lg font-heading font-bold", s.color)}>{s.value}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
