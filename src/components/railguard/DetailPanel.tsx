import { TrainRoute, Anomaly } from "@/lib/railguard/types";
import { getAIExplanation } from "@/lib/railguard/engine";
import { cn } from "@/lib/utils";
import {
  Train, MapPin, Clock, AlertTriangle, ArrowRight,
  Sparkles, ShieldAlert, Activity, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  route: TrainRoute | null;
  anomalies: Anomaly[];
}

export default function DetailPanel({ route, anomalies }: Props) {
  const [activeTab, setActiveTab] = useState<"info" | "anomalies" | "ai">("info");
  const [aiText, setAiText] = useState("");

  const routeAnomalies = anomalies.filter(a => 
    route?.anomalies.includes(a.type)
  );

  useEffect(() => {
    if (activeTab === "ai" && routeAnomalies.length > 0) {
      setAiText("");
      const text = getAIExplanation(routeAnomalies[0].type);
      let i = 0;
      const interval = setInterval(() => {
        i += 4;
        setAiText(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 8);
      return () => clearInterval(interval);
    }
  }, [activeTab, route?.id]);

  if (!route) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
        <Train className="w-12 h-12 opacity-20 mb-3" />
        <p className="text-sm font-medium">Select a train</p>
        <p className="text-xs mt-1 opacity-60">Click on the map or list</p>
      </div>
    );
  }

  const tabs = [
    { id: "info" as const, label: "Route" },
    { id: "anomalies" as const, label: `Alerts (${routeAnomalies.length})` },
    { id: "ai" as const, label: "AI" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Train className={cn("w-4 h-4", route.anomalies.length > 0 ? "text-danger" : "text-primary")} />
          <span className="font-heading font-bold text-lg">{route.id}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{route.type}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>{route.from.city}</span>
          <ArrowRight className="w-3 h-3" />
          <span>{route.to.city}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-3 space-y-3">
              <InfoRow icon={MapPin} label="From" value={route.from.name} />
              <InfoRow icon={MapPin} label="To" value={route.to.name} />
              <InfoRow icon={Activity} label="Progress" value={`${Math.round(route.progress * 100)}%`} />
              <InfoRow
                icon={Clock}
                label="Status"
                value={route.delay > 0 ? `Delayed +${route.delay}m` : "On time"}
                valueClass={route.delay > 0 ? "text-warning" : "text-success"}
              />
            </div>

            {/* Mini progress */}
            <div>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>{route.from.id}</span>
                <span>{route.to.id}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", route.anomalies.length > 0 ? "bg-danger" : "bg-primary")}
                  style={{ width: `${route.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "anomalies" && (
          <div className="space-y-2">
            {routeAnomalies.length === 0 ? (
              <div className="text-center py-8">
                <ShieldAlert className="w-8 h-8 text-success/30 mx-auto mb-2" />
                <p className="text-sm text-success">No anomalies</p>
              </div>
            ) : (
              routeAnomalies.map(a => (
                <div
                  key={a.id}
                  className={cn(
                    "p-3 rounded-xl border",
                    a.severity === "critical" ? "bg-danger/5 border-danger/20" : "bg-warning/5 border-warning/20"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={cn("w-3.5 h-3.5", a.severity === "critical" ? "text-danger" : "text-warning")} />
                    <span className={cn("text-sm font-semibold", a.severity === "critical" ? "text-danger" : "text-warning")}>
                      {a.type.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70">{a.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Confidence: {a.confidence}%</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div>
            {routeAnomalies.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-primary/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No anomalies to analyze</p>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-heading font-semibold text-primary uppercase">AI Analysis</span>
                </div>
                <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {aiText.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={i} className="font-bold text-foreground mt-2 first:mt-0">{line.replace(/\*\*/g, "")}</p>;
                    }
                    if (line.includes("Risk Level")) {
                      return <p key={i} className="font-bold text-danger mt-2">{line.replace(/\*\*/g, "")}</p>;
                    }
                    return <p key={i} className="mt-1">{line.replace(/\*\*/g, "")}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass }: { icon: React.ElementType; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <span className={cn("text-xs font-medium", valueClass || "text-foreground")}>{value}</span>
    </div>
  );
}
