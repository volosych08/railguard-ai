import { TrainRoute } from "@/lib/railguard/types";
import { cn } from "@/lib/utils";
import { Train, AlertTriangle, Clock, ArrowRight, Zap } from "lucide-react";

interface Props {
  routes: TrainRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

const typeColors: Record<string, string> = {
  Intercity: "bg-primary/15 text-primary",
  Sprinter: "bg-secondary/15 text-secondary",
  ICE: "bg-accent/15 text-accent",
  Thalys: "bg-destructive/15 text-destructive",
};

export default function TrainList({ routes, selectedRouteId, onSelectRoute }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-heading font-semibold text-foreground">Active Trains</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{routes.length} trains in network</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const hasAnomaly = route.anomalies.length > 0;
          
          return (
            <button
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all duration-200",
                "hover:bg-muted/50",
                isSelected ? "glass glow-blue" : "bg-transparent",
                hasAnomaly && !isSelected && "border border-danger/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Train className={cn("w-4 h-4", hasAnomaly ? "text-danger" : "text-primary")} />
                  <span className="font-heading font-semibold text-sm">{route.id}</span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", typeColors[route.type])}>
                    {route.type}
                  </span>
                </div>
                {hasAnomaly && <AlertTriangle className="w-3.5 h-3.5 text-danger" />}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-foreground/80">{route.from.city}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-foreground/80">{route.to.city}</span>
              </div>

              <div className="flex items-center gap-3 mt-2">
                {/* Progress bar */}
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      hasAnomaly ? "bg-danger" : "bg-primary"
                    )}
                    style={{ width: `${route.progress * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{Math.round(route.progress * 100)}%</span>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                {route.delay > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-warning">
                    <Clock className="w-2.5 h-2.5" />
                    +{route.delay}m
                  </span>
                )}
                {route.status === "on_time" && (
                  <span className="flex items-center gap-1 text-[10px] text-success">
                    <Zap className="w-2.5 h-2.5" />
                    On time
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
