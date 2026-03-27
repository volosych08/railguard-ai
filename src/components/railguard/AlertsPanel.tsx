import { Anomaly } from "@/lib/railguard/types";
import { timeToDisplay } from "@/lib/railguard/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle, XCircle, ShieldAlert } from "lucide-react";

interface Props {
  anomalies: Anomaly[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
}

const severityConfig = {
  critical: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  info: { icon: ShieldAlert, color: "text-info", bg: "bg-info/10", border: "border-info/30" },
};

export default function AlertsPanel({ anomalies, selectedEventId, onSelectEvent }: Props) {
  const criticals = anomalies.filter((a) => a.severity === "critical");
  const warnings = anomalies.filter((a) => a.severity === "warning");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
          Anomaly Alerts
        </h2>
        <span className="text-xs font-mono text-danger">{criticals.length} critical</span>
        <span className="text-xs font-mono text-warning">{warnings.length} warning</span>
      </div>

      <div className="flex flex-col gap-2 px-2 overflow-y-auto max-h-[calc(100vh-400px)]">
        {anomalies.map((anomaly, i) => {
          const config = severityConfig[anomaly.severity];
          const Icon = config.icon;
          const isSelected = selectedEventId === anomaly.eventId;

          return (
            <button
              key={anomaly.id}
              onClick={() => onSelectEvent(anomaly.eventId)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-md border transition-all text-left animate-slide-in",
                config.bg,
                config.border,
                isSelected && "ring-1 ring-primary"
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("text-sm font-semibold", config.color)}>
                    {anomaly.type.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {timeToDisplay(anomaly.time)}
                  </span>
                </div>
                <p className="text-xs text-foreground/70 mt-1">{anomaly.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-muted-foreground">
                  <span>Confidence: {anomaly.confidence}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
