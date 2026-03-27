import { Train, Activity, MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="glass border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 glow-blue">
          <Train className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-heading font-bold tracking-tight text-gradient">
            RailGuard AI
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Netherlands Railway Monitoring
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
          <Activity className="w-3 h-3 text-success animate-pulse" />
          <span className="text-xs font-medium text-success">Live</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" })}
        </span>
      </div>
    </header>
  );
}
