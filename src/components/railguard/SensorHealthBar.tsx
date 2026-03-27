import { SensorHealth } from "@/lib/railguard/types";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Signal } from "lucide-react";

interface Props {
  sensors: SensorHealth[];
}

const statusConfig = {
  online: { icon: Wifi, color: "text-success" },
  degraded: { icon: Signal, color: "text-warning" },
  offline: { icon: WifiOff, color: "text-danger" },
};

export default function SensorHealthBar({ sensors }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-1.5 border-b border-border overflow-x-auto">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider shrink-0 font-medium">
        Sensors
      </span>
      {sensors.map((s) => {
        const config = statusConfig[s.status];
        const Icon = config.icon;
        return (
          <div key={s.sensorId} className="flex items-center gap-1 shrink-0">
            <Icon className={cn("w-2.5 h-2.5", config.color)} />
            <span className="text-[10px] text-foreground/60">{s.sensorId}</span>
            <span className={cn("text-[10px] font-medium", config.color)}>{s.reliability}%</span>
          </div>
        );
      })}
    </div>
  );
}
