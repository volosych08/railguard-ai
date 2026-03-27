import { RawSensorEvent, ReconstructedEvent, Anomaly, SensorHealth } from "./types";

let idCounter = 0;
const uid = () => `evt-${++idCounter}`;
const aid = () => `ano-${++idCounter}`;

// Step 1: Normalize & sort
export function normalize(events: RawSensorEvent[]): RawSensorEvent[] {
  return [...events].sort((a, b) => a.time - b.time);
}

// Step 2: Group nearby events (±5 time units)
function groupEvents(events: RawSensorEvent[]): RawSensorEvent[][] {
  const groups: RawSensorEvent[][] = [];
  let current: RawSensorEvent[] = [];

  for (const evt of events) {
    if (current.length === 0 || evt.time - current[0].time <= 5) {
      current.push(evt);
    } else {
      groups.push(current);
      current = [evt];
    }
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

// Step 3: Reconstruct events
export function reconstruct(raw: RawSensorEvent[]): ReconstructedEvent[] {
  const sorted = normalize(raw);
  const groups = groupEvents(sorted);

  return groups.map((group) => {
    const sources = [...new Set(group.map((e) => e.type))];
    const hasCamera = group.some((e) => e.type === "camera" && e.value === true);
    const hasAxle = group.some((e) => e.type === "axle");
    const hasSwitch = group.some((e) => e.type === "switch");

    let type: ReconstructedEvent["type"] = "sensor_reading";
    if (hasCamera || hasAxle) type = "train_detected";
    if (hasSwitch && !hasCamera && !hasAxle) type = "switch_change";

    const confidence = calculateConfidence(group);

    return {
      id: uid(),
      time: group[0].time,
      type,
      sources,
      confidence,
      details: Object.fromEntries(group.map((e) => [e.type, e.value])),
    };
  });
}

function calculateConfidence(group: RawSensorEvent[]): number {
  const types = new Set(group.map((e) => e.type));
  const hasCamera = group.some((e) => e.type === "camera" && e.value === true);
  const hasCameraFalse = group.some((e) => e.type === "camera" && e.value === false);
  const hasAxle = group.some((e) => e.type === "axle");

  if (hasCameraFalse && hasAxle) return 30; // conflicting
  if (types.size >= 2) return 90;
  return 50;
}

// Step 4: Detect anomalies
export function detect(events: ReconstructedEvent[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  for (const evt of events) {
    const d = evt.details;

    // Ghost Train: camera detected but no axle
    if (d.camera === true && !("axle" in d)) {
      anomalies.push({
        id: aid(),
        type: "ghost_train",
        eventId: evt.id,
        time: evt.time,
        severity: "critical",
        confidence: evt.confidence,
        description: "Camera detected movement but axle counter reported nothing",
        sensorData: d,
      });
    }

    // Axle mismatch
    if (typeof d.axle === "number" && (d.axle < 4 || d.axle > 200)) {
      anomalies.push({
        id: aid(),
        type: "axle_mismatch",
        eventId: evt.id,
        time: evt.time,
        severity: "warning",
        confidence: evt.confidence,
        description: `Unusual axle count: ${d.axle} (expected 4-200)`,
        sensorData: d,
      });
    }

    // Unsafe switch: switch change during train presence
    if ("switch" in d && (d.camera === true || "axle" in d)) {
      anomalies.push({
        id: aid(),
        type: "unsafe_switch",
        eventId: evt.id,
        time: evt.time,
        severity: "critical",
        confidence: 95,
        description: "Track switch changed while train was present on track",
        sensorData: d,
      });
    }

    // Sensor conflict
    if (d.camera === false && ("axle" in d || "vibration" in d)) {
      const axle = d.axle as number | undefined;
      const vib = d.vibration as number | undefined;
      if ((axle && axle > 0) || (vib && vib > 30)) {
        anomalies.push({
          id: aid(),
          type: "sensor_conflict",
          eventId: evt.id,
          time: evt.time,
          severity: "warning",
          confidence: 30,
          description: "Camera reports no train but other sensors disagree",
          sensorData: d,
        });
      }
    }
  }

  return anomalies;
}

// Sensor health
export function analyzeSensorHealth(raw: RawSensorEvent[]): SensorHealth[] {
  const sensors = new Map<string, { type: string; events: number; lastTime: number }>();
  for (const e of raw) {
    const id = e.sensorId || e.type;
    const existing = sensors.get(id);
    if (!existing) {
      sensors.set(id, { type: e.type, events: 1, lastTime: e.time });
    } else {
      existing.events++;
      existing.lastTime = Math.max(existing.lastTime, e.time);
    }
  }

  return Array.from(sensors.entries()).map(([id, data]) => ({
    sensorId: id,
    type: data.type,
    reliability: Math.min(100, data.events * 20),
    lastActive: data.lastTime,
    status: data.events >= 3 ? "online" : data.events >= 2 ? "degraded" : "offline",
  }));
}

// AI explanations (mock)
const explanations: Record<string, string> = {
  ghost_train:
    "**Ghost Train Detected**\n\nThe camera system registered movement consistent with a train passing, but the axle counter did not record any axles.\n\n**Possible Causes:**\n1. Axle counter malfunction or miscalibration\n2. Debris or wildlife triggering camera motion detection\n3. Light/shadow anomaly causing false camera positive\n\n**Risk Level: HIGH** — If a real train passed undetected by the axle counter, this indicates a critical sensor failure that could lead to track conflicts.",
  axle_mismatch:
    "**Axle Count Anomaly**\n\nThe axle counter reported an unusual number of axles that falls outside normal operational range.\n\n**Possible Causes:**\n1. Partial sensor obstruction causing missed counts\n2. Electromagnetic interference near sensor\n3. Sensor degradation due to weather/age\n\n**Risk Level: MEDIUM** — Inaccurate axle counts can lead to incorrect train identification and scheduling conflicts.",
  unsafe_switch:
    "**CRITICAL: Unsafe Switch Operation**\n\nA track switch position change was detected while a train was occupying the track section.\n\n**Possible Causes:**\n1. Control system timing error\n2. Manual override by operator without proper clearance\n3. Signal system failure causing premature switch activation\n\n**Risk Level: CRITICAL** — This is a derailment hazard. Immediate investigation required.",
  sensor_conflict:
    "**Sensor Data Conflict**\n\nCamera reports no train presence, but axle counter and/or vibration sensors indicate otherwise.\n\n**Possible Causes:**\n1. Camera obstruction (fog, dirt, misalignment)\n2. Camera feed delay or frame drop\n3. Other sensors detecting maintenance equipment\n\n**Risk Level: MEDIUM** — Conflicting data reduces situational confidence. Verify camera integrity.",
};

export function getAIExplanation(type: string): string {
  return explanations[type] || "No explanation available for this anomaly type.";
}
