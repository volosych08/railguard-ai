import { ReconstructedEvent, Anomaly } from "@/lib/railguard/types";
import { timeToDisplay } from "@/lib/railguard/mockData";
import { Train, AlertTriangle, XCircle, GitBranch, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  events: ReconstructedEvent[];
  anomalies: Anomaly[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  maxTime: number;
}

const typeIcons: Record<string, React.ElementType> = {
  train_detected: Train,
  switch_change: GitBranch,
  sensor_reading: Radio,
  unknown: Radio,
};

export default function Timeline({ events, anomalies, selectedEventId, onSelectEvent, maxTime }: Props) {
  const anomalyMap = new Map(anomalies.map((a) => [a.eventId, a]));

  const filteredEvents = events.filter((e) => e.time <= maxTime);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
          Event Timeline
        </h2>
        <span className="text-xs font-mono text-primary">{filteredEvents.length} events</span>
      </div>
      <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[calc(100vh-220px)] px-2">
        {filteredEvents.map((evt, i) => {
          const anomaly = anomalyMap.get(evt.id);
          const Icon = typeIcons[evt.type] || Radio;
          const isSelected = selectedEventId === evt.id;

          return (
            <button
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all animate-slide-in",
                "hover:bg-muted/50",
                isSelected && "bg-muted border border-primary/30",
                !isSelected && "border border-transparent"
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">
                {timeToDisplay(evt.time)}
              </span>

              <div
                className={cn(
                  "p-1.5 rounded",
                  anomaly?.severity === "critical" && "bg-danger/15 text-danger",
                  anomaly?.severity === "warning" && "bg-warning/15 text-warning",
                  !anomaly && "bg-secondary/15 text-secondary"
                )}
              >
                {anomaly?.severity === "critical" ? (
                  <XCircle className="w-4 h-4" />
                ) : anomaly ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {anomaly ? anomaly.description : evt.type.replace("_", " ")}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {evt.sources.join(" + ")} · {evt.confidence}%
                </div>
              </div>

              {anomaly && (
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded",
                    anomaly.severity === "critical" && "bg-danger/20 text-danger",
                    anomaly.severity === "warning" && "bg-warning/20 text-warning"
                  )}
                >
                  {anomaly.severity}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
