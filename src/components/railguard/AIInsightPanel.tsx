import { useState, useEffect } from "react";
import { Anomaly, ReconstructedEvent } from "@/lib/railguard/types";
import { getAIExplanation } from "@/lib/railguard/engine";
import { timeToDisplay } from "@/lib/railguard/mockData";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  event: ReconstructedEvent | null;
  anomaly: Anomaly | null;
}

export default function AIInsightPanel({ event, anomaly }: Props) {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!anomaly) {
      setExplanation("");
      setDisplayedText("");
      return;
    }

    setLoading(true);
    setDisplayedText("");

    // Simulate AI typing
    const timer = setTimeout(() => {
      const text = getAIExplanation(anomaly.type);
      setExplanation(text);
      setLoading(false);

      let i = 0;
      const interval = setInterval(() => {
        i += 3;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 10);

      return () => clearInterval(interval);
    }, 800);

    return () => clearTimeout(timer);
  }, [anomaly?.id]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground p-8">
        <Brain className="w-10 h-10 opacity-30" />
        <p className="text-sm text-center font-mono">Select an event to view AI analysis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Event details */}
      <div className="p-3 rounded-md bg-muted/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
            Event Details
          </span>
          <span className="text-xs font-mono text-primary">{timeToDisplay(event.time)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-muted-foreground">Type:</span>{" "}
            <span className="text-foreground">{event.type}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Confidence:</span>{" "}
            <span className={cn(
              event.confidence >= 80 ? "text-success" : event.confidence >= 50 ? "text-warning" : "text-danger"
            )}>
              {event.confidence}%
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Sources:</span>{" "}
            <span className="text-foreground">{event.sources.join(", ")}</span>
          </div>
        </div>
        {/* Raw sensor data */}
        <div className="mt-3 pt-2 border-t border-border">
          <span className="text-xs font-mono text-muted-foreground">Sensor Data:</span>
          <pre className="text-xs font-mono text-secondary mt-1 whitespace-pre-wrap">
            {JSON.stringify(event.details, null, 2)}
          </pre>
        </div>
      </div>

      {/* AI Explanation */}
      {anomaly && (
        <div className="p-3 rounded-md border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono font-semibold text-primary uppercase">
              AI Analysis
            </span>
            {loading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
            {displayedText.split("\n").map((line, i) => {
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="font-bold text-foreground mt-2 first:mt-0">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("**Risk Level:")) {
                const clean = line.replace(/\*\*/g, "");
                return (
                  <p key={i} className="font-bold text-danger mt-2">
                    {clean}
                  </p>
                );
              }
              return <p key={i} className="mt-1">{line.replace(/\*\*/g, "")}</p>;
            })}
          </div>
        </div>
      )}

      {!anomaly && (
        <div className="p-3 rounded-md bg-success/5 border border-success/20">
          <p className="text-sm text-success font-mono">✓ No anomalies detected for this event</p>
        </div>
      )}
    </div>
  );
}
