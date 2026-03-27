export interface RawSensorEvent {
  time: number;
  type: "camera" | "axle" | "switch" | "weight" | "vibration";
  value: boolean | number | string;
  sensorId?: string;
}

export interface ReconstructedEvent {
  id: string;
  time: number;
  type: "train_detected" | "switch_change" | "sensor_reading" | "unknown";
  sources: string[];
  confidence: number;
  details: Record<string, unknown>;
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
}

export interface SensorHealth {
  sensorId: string;
  type: string;
  reliability: number;
  lastActive: number;
  status: "online" | "degraded" | "offline";
}
