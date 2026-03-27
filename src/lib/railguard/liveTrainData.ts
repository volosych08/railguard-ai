// mockLiveData.ts
import { TrainRoute } from "./types";
import { stations, getStation } from "./stations";
import { calculateDelay } from "./nsApi";

/**
 * Simulate live train data
 */
export const liveTrainData: TrainRoute[] = [
  {
    id: "IC-1555",
    trainId: "NS-1555",
    type: "Intercity",
    from: getStation("ASD"),
    to: getStation("UT"),
    departureTime: Date.now() - 5 * 60_000, // left 5 min ago
    arrivalTime: Date.now() + 25 * 60_000,  // will arrive in 25 min
    status: "running",
    delay: 2,
    progress: 0.17,
    anomalies: [],
    currentLat: 52.3791 + (52.0893 - 52.3791) * 0.17,
    currentLng: 4.9003 + (5.1101 - 4.9003) * 0.17,
  },
  {
    id: "SPR-7744",
    trainId: "NS-7744",
    type: "Sprinter",
    from: getStation("HTN"),
    to: getStation("SHL"),
    departureTime: Date.now() - 2 * 60_000,
    arrivalTime: Date.now() + 8 * 60_000,
    status: "on_time",
    delay: 0,
    progress: 0.25,
    anomalies: ["sensor_conflict"],
    currentLat: 52.3874 + (52.3090 - 52.3874) * 0.25,
    currentLng: 4.6383 + (4.7610 - 4.6383) * 0.25,
  },
  // Add more trains as needed...
];

/**
 * Function to simulate train movement over time
 */
export function updateLiveTrainPositions(): TrainRoute[] {
  const now = Date.now();
  return liveTrainData.map(train => {
    const totalDuration = train.arrivalTime - train.departureTime;
    const elapsed = now - train.departureTime;
    const progress = Math.min(1, Math.max(0, totalDuration > 0 ? elapsed / totalDuration : 0));

    return {
      ...train,
      progress,
      currentLat: train.from.lat + (train.to.lat - train.from.lat) * progress,
      currentLng: train.from.lng + (train.to.lng - train.from.lng) * progress,
    };
  });
}