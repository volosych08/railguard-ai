import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  minTime: number;
  maxTime: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
}

export default function ReplaySlider({ minTime, maxTime, currentTime, onTimeChange }: Props) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        onTimeChange(Math.min(currentTime + 10, maxTime));
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, currentTime, maxTime, onTimeChange]);

  useEffect(() => {
    if (currentTime >= maxTime) setPlaying(false);
  }, [currentTime, maxTime]);

  const progress = ((currentTime - minTime) / (maxTime - minTime)) * 100;

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-t border-border bg-card/50">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Replay</span>

      <button
        onClick={() => setPlaying(!playing)}
        className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={() => { setPlaying(false); onTimeChange(minTime); }}
        className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1 relative h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          onTimeChange(Math.round(minTime + pct * (maxTime - minTime)));
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary/60 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg transition-all duration-200"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <span className="text-xs font-mono text-primary w-10 text-right">
        {String(Math.floor(currentTime / 100)).padStart(2, "0")}:
        {String(currentTime % 100).padStart(2, "0")}
      </span>
    </div>
  );
}
