import { RawSensorEvent } from "./types";

export const rawSensorData: RawSensorEvent[] = [
  // Amsterdam Centraal - Normal train pass
  { time: 100, type: "camera", value: true, sensorId: "CAM-ASD-01", stationId: "ASD" },
  { time: 101, type: "axle", value: 8, sensorId: "AXL-ASD-01", stationId: "ASD" },
  { time: 102, type: "vibration", value: 85, sensorId: "VIB-ASD-01", stationId: "ASD" },
  { time: 103, type: "weight", value: 4200, sensorId: "WGT-ASD-01", stationId: "ASD" },

  // Utrecht - Ghost train (camera, no axle)
  { time: 200, type: "camera", value: true, sensorId: "CAM-UT-01", stationId: "UT" },
  { time: 201, type: "vibration", value: 12, sensorId: "VIB-UT-01", stationId: "UT" },

  // Rotterdam - Switch change
  { time: 300, type: "switch", value: "left", sensorId: "SWT-RTD-01", stationId: "RTD" },

  // Eindhoven - Normal train
  { time: 400, type: "camera", value: true, sensorId: "CAM-EHV-01", stationId: "EHV" },
  { time: 401, type: "axle", value: 12, sensorId: "AXL-EHV-01", stationId: "EHV" },
  { time: 402, type: "weight", value: 6100, sensorId: "WGT-EHV-01", stationId: "EHV" },

  // Arnhem - Axle mismatch
  { time: 500, type: "camera", value: true, sensorId: "CAM-AH-01", stationId: "AH" },
  { time: 501, type: "axle", value: 2, sensorId: "AXL-AH-01", stationId: "AH" },

  // Den Haag - Unsafe switch (during train)
  { time: 600, type: "camera", value: true, sensorId: "CAM-GVC-01", stationId: "GVC" },
  { time: 601, type: "axle", value: 10, sensorId: "AXL-GVC-01", stationId: "GVC" },
  { time: 602, type: "switch", value: "right", sensorId: "SWT-GVC-01", stationId: "GVC" },
  { time: 603, type: "vibration", value: 92, sensorId: "VIB-GVC-01", stationId: "GVC" },

  // Schiphol - Sensor conflict
  { time: 700, type: "camera", value: false, sensorId: "CAM-SHL-01", stationId: "SHL" },
  { time: 701, type: "axle", value: 6, sensorId: "AXL-SHL-01", stationId: "SHL" },
  { time: 702, type: "vibration", value: 78, sensorId: "VIB-SHL-01", stationId: "SHL" },

  // Groningen - Normal
  { time: 800, type: "camera", value: true, sensorId: "CAM-GN-01", stationId: "GN" },
  { time: 801, type: "axle", value: 16, sensorId: "AXL-GN-01", stationId: "GN" },
  { time: 802, type: "weight", value: 8400, sensorId: "WGT-GN-01", stationId: "GN" },
  { time: 803, type: "vibration", value: 95, sensorId: "VIB-GN-01", stationId: "GN" },
];

export function timeToDisplay(t: number): string {
  const hours = Math.floor(t / 100);
  const minutes = t % 100;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
