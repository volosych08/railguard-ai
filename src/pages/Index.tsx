import { useState, useCallback, useMemo } from "react";
import { rawSensorData } from "@/lib/railguard/mockData";
import { reconstruct, detect, analyzeSensorHealth } from "@/lib/railguard/engine";
import Header from "@/components/railguard/Header";
import StatsBar from "@/components/railguard/StatsBar";
import SensorHealthBar from "@/components/railguard/SensorHealthBar";
import Timeline from "@/components/railguard/Timeline";
import AlertsPanel from "@/components/railguard/AlertsPanel";
import AIInsightPanel from "@/components/railguard/AIInsightPanel";
import ReplaySlider from "@/components/railguard/ReplaySlider";

export default function Index() {
  const events = useMemo(() => reconstruct(rawSensorData), []);
  const anomalies = useMemo(() => detect(events), [events]);
  const sensors = useMemo(() => analyzeSensorHealth(rawSensorData), []);

  const allTimes = events.map((e) => e.time);
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [replayTime, setReplayTime] = useState(maxTime);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;
  const selectedAnomaly = anomalies.find((a) => a.eventId === selectedEventId) || null;

  const handleTimeChange = useCallback((t: number) => setReplayTime(t), []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <StatsBar events={events} anomalies={anomalies} />
      <SensorHealthBar sensors={sensors} />

      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden border-t border-border">
        {/* Timeline */}
        <div className="col-span-5 border-r border-border overflow-hidden">
          <Timeline
            events={events}
            anomalies={anomalies}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
            maxTime={replayTime}
          />
        </div>

        {/* Alerts */}
        <div className="col-span-3 border-r border-border overflow-hidden">
          <AlertsPanel
            anomalies={anomalies.filter((a) => a.time <= replayTime)}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
        </div>

        {/* AI Panel */}
        <div className="col-span-4 overflow-y-auto">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
              AI Insight
            </h2>
          </div>
          <AIInsightPanel event={selectedEvent} anomaly={selectedAnomaly} />
        </div>
      </div>

      <ReplaySlider
        minTime={minTime}
        maxTime={maxTime}
        currentTime={replayTime}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
}
