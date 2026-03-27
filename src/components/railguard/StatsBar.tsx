import { ReconstructedEvent, Anomaly } from "@/lib/railguard/types";
import { Train, AlertTriangle, XCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  events: ReconstructedEvent[];
  anomalies: Anomaly[];
}

export default function StatsBar({ events, anomalies }: Props) {
  const criticals = anomalies.filter((a) => a.severity === "critical").length;
  const warnings = anomalies.filter((a) => a.severity === "warning").length;
  const avgConfidence = Math.round(events.reduce((s, e) => s + e.confidence, 0) / events.length);

  const stats = [
    { label: "Events", value: events.length, icon: Train, color: "text-secondary" },
    { label: "Critical", value: criticals, icon: XCircle, color: "text-danger" },
    { label: "Warnings", value: warnings, icon: AlertTriangle, color: "text-warning" },
    { label: "Avg Confidence", value: `${avgConfidence}%`, icon: Activity, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-border">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border border-border">
          <s.icon className={cn("w-4 h-4", s.color)} />
          <div>
            <div className={cn("text-lg font-bold font-mono", s.color)}>{s.value}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
