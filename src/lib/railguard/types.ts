export interface RawSensorEvent {
  time: number;
  type: "camera" | "axle" | "switch" | "weight" | "vibration";
  value: boolean | number | string;
  sensorId?: string;
  stationId?: string;
}

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

export interface TrainRoute {
  id: string;
  trainId: string;
  type: "Intercity" | "Sprinter" | "ICE" | "Thalys";
  from: Station;
  to: Station;
  departureTime: number;
  arrivalTime: number;
  status: "on_time" | "delayed" | "cancelled" | "running";
  delay: number; // minutes
  currentLat?: number;
  currentLng?: number;
  progress: number; // 0-1
  anomalies: string[];
}

export interface ReconstructedEvent {
  id: string;
  time: number;
  type: "train_detected" | "switch_change" | "sensor_reading" | "unknown";
  sources: string[];
  confidence: number;
  details: Record<string, unknown>;
  routeId?: string;
  stationId?: string;
}

export interface Anomaly {
  id: string;
  type: "ghost_train" | "axle_mismatch" | "unsafe_switch" | "sensor_conflict";
  eventId: string;
  time: number;
  severity: "critical" | "warning" | "info";
  confidence: number;
  description: string;
  sensorData: Record<string, unknown>;
  aiExplanation?: string;
  routeId?: string;
  location?: string;
}

export interface SensorHealth {
  sensorId: string;
  type: string;
  reliability: number;
  lastActive: number;
  status: "online" | "degraded" | "offline";
  stationId?: string;
}
