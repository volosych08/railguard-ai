import { useState, useMemo } from "react";
import { rawSensorData } from "@/lib/railguard/mockData";
import { reconstruct, detect, analyzeSensorHealth } from "@/lib/railguard/engine";
import { generateTrainRoutes } from "@/lib/railguard/stations";
import Header from "@/components/railguard/Header";
import StatsBar from "@/components/railguard/StatsBar";
import SensorHealthBar from "@/components/railguard/SensorHealthBar";
import RailMap from "@/components/railguard/RailMap";
import TrainList from "@/components/railguard/TrainList";
import DetailPanel from "@/components/railguard/DetailPanel";

export default function Index() {
  const events = useMemo(() => reconstruct(rawSensorData), []);
  const anomalies = useMemo(() => detect(events), [events]);
  const sensors = useMemo(() => analyzeSensorHealth(rawSensorData), []);
  const routes = useMemo(() => generateTrainRoutes(), []);

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || null;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />
      <StatsBar routes={routes} anomalies={anomalies} />
      <SensorHealthBar sensors={sensors} />

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Train List */}
        <div className="col-span-3 border-r border-border overflow-hidden">
          <TrainList
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />
        </div>

        {/* Map */}
        <div className="col-span-6 relative">
          <RailMap
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />
        </div>

        {/* Detail Panel */}
        <div className="col-span-3 border-l border-border overflow-hidden">
          <DetailPanel route={selectedRoute} anomalies={anomalies} />
        </div>
      </div>
    </div>
  );
}
