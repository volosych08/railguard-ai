import { Shield, Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-mono tracking-tight text-primary">
            RAILGUARD AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Rail Yard Event Reconstruction & Anomaly Detection
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Activity className="w-3 h-3 text-success animate-pulse-glow" />
        <span>SYSTEM ACTIVE</span>
        <span className="text-border">|</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </header>
  );
}
