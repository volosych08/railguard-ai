import { SensorHealth } from "@/lib/railguard/types";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Signal } from "lucide-react";

interface Props {
  sensors: SensorHealth[];
}

const statusConfig = {
  online: { icon: Wifi, color: "text-success", label: "Online" },
  degraded: { icon: Signal, color: "text-warning", label: "Degraded" },
  offline: { icon: WifiOff, color: "text-danger", label: "Offline" },
};

export default function SensorHealthBar({ sensors }: Props) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-card/50 overflow-x-auto">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider shrink-0">
        Sensors:
      </span>
      {sensors.map((s) => {
        const config = statusConfig[s.status];
        const Icon = config.icon;
        return (
          <div key={s.sensorId} className="flex items-center gap-1.5 shrink-0">
            <Icon className={cn("w-3 h-3", config.color)} />
            <span className="text-xs font-mono text-foreground/80">{s.sensorId}</span>
            <span className={cn("text-[10px] font-mono", config.color)}>
              {s.reliability}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
