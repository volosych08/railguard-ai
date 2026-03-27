import { RawSensorEvent } from "./types";

export const rawSensorData: RawSensorEvent[] = [
  // Normal train pass
  { time: 100, type: "camera", value: true, sensorId: "CAM-01" },
  { time: 101, type: "axle", value: 8, sensorId: "AXL-01" },
  { time: 102, type: "vibration", value: 85, sensorId: "VIB-01" },
  { time: 103, type: "weight", value: 4200, sensorId: "WGT-01" },

  // Ghost train (camera, no axle)
  { time: 200, type: "camera", value: true, sensorId: "CAM-02" },
  { time: 201, type: "vibration", value: 12, sensorId: "VIB-02" },

  // Switch change
  { time: 300, type: "switch", value: "left", sensorId: "SWT-01" },

  // Normal train
  { time: 400, type: "camera", value: true, sensorId: "CAM-01" },
  { time: 401, type: "axle", value: 12, sensorId: "AXL-01" },
  { time: 402, type: "weight", value: 6100, sensorId: "WGT-01" },

  // Axle mismatch
  { time: 500, type: "camera", value: true, sensorId: "CAM-03" },
  { time: 501, type: "axle", value: 2, sensorId: "AXL-02" },

  // Unsafe switch (during train)
  { time: 600, type: "camera", value: true, sensorId: "CAM-01" },
  { time: 601, type: "axle", value: 10, sensorId: "AXL-01" },
  { time: 602, type: "switch", value: "right", sensorId: "SWT-01" },
  { time: 603, type: "vibration", value: 92, sensorId: "VIB-01" },

  // Sensor conflict
  { time: 700, type: "camera", value: false, sensorId: "CAM-01" },
  { time: 701, type: "axle", value: 6, sensorId: "AXL-01" },
  { time: 702, type: "vibration", value: 78, sensorId: "VIB-01" },

  // Late night normal
  { time: 800, type: "camera", value: true, sensorId: "CAM-02" },
  { time: 801, type: "axle", value: 16, sensorId: "AXL-02" },
  { time: 802, type: "weight", value: 8400, sensorId: "WGT-02" },
  { time: 803, type: "vibration", value: 95, sensorId: "VIB-02" },
];

export function timeToDisplay(t: number): string {
  const hours = Math.floor(t / 100);
  const minutes = t % 100;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
