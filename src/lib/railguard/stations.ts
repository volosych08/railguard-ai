import { Station, TrainRoute } from "./types";

export const stations: Station[] = [
  { id: "ASD", name: "Amsterdam Centraal", lat: 52.3791, lng: 4.9003, city: "Amsterdam" },
  { id: "UT", name: "Utrecht Centraal", lat: 52.0893, lng: 5.1101, city: "Utrecht" },
  { id: "RTD", name: "Rotterdam Centraal", lat: 51.9244, lng: 4.4690, city: "Rotterdam" },
  { id: "GVC", name: "Den Haag Centraal", lat: 52.0808, lng: 4.3248, city: "Den Haag" },
  { id: "EHV", name: "Eindhoven Centraal", lat: 51.4433, lng: 5.4795, city: "Eindhoven" },
  { id: "AH", name: "Arnhem Centraal", lat: 51.9851, lng: 5.8987, city: "Arnhem" },
  { id: "GN", name: "Groningen", lat: 53.2108, lng: 6.5644, city: "Groningen" },
  { id: "MT", name: "Maastricht", lat: 50.8492, lng: 5.7053, city: "Maastricht" },
  { id: "LW", name: "Leeuwarden", lat: 53.1960, lng: 5.7920, city: "Leeuwarden" },
  { id: "ZL", name: "Zwolle", lat: 52.5047, lng: 6.0919, city: "Zwolle" },
  { id: "AMD", name: "Amersfoort", lat: 52.1539, lng: 5.3753, city: "Amersfoort" },
  { id: "BD", name: "Breda", lat: 51.5955, lng: 4.7804, city: "Breda" },
  { id: "NMG", name: "Nijmegen", lat: 51.8433, lng: 5.8527, city: "Nijmegen" },
  { id: "HTN", name: "Haarlem", lat: 52.3874, lng: 4.6383, city: "Haarlem" },
  { id: "LEDN", name: "Leiden Centraal", lat: 52.1662, lng: 4.4819, city: "Leiden" },
  { id: "DT", name: "Delft", lat: 52.0067, lng: 4.3564, city: "Delft" },
  { id: "SHL", name: "Schiphol Airport", lat: 52.3090, lng: 4.7610, city: "Schiphol" },
];

export const stationMap = new Map(stations.map(s => [s.id, s]));

export function getStation(id: string): Station {
  return stationMap.get(id) || stations[0];
}

// Simulated live train routes
export function generateTrainRoutes(): TrainRoute[] {
  const now = Date.now();
  const routes: TrainRoute[] = [
    {
      id: "IC-2043",
      trainId: "NS-2043",
      type: "Intercity",
      from: getStation("ASD"),
      to: getStation("RTD"),
      departureTime: now - 25 * 60000,
      arrivalTime: now + 35 * 60000,
      status: "running",
      delay: 0,
      progress: 0.42,
      anomalies: [],
    },
    {
      id: "IC-1547",
      trainId: "NS-1547",
      type: "Intercity",
      from: getStation("UT"),
      to: getStation("GN"),
      departureTime: now - 45 * 60000,
      arrivalTime: now + 75 * 60000,
      status: "delayed",
      delay: 8,
      progress: 0.38,
      anomalies: ["ghost_train"],
    },
    {
      id: "SPR-4521",
      trainId: "NS-4521",
      type: "Sprinter",
      from: getStation("GVC"),
      to: getStation("LEDN"),
      departureTime: now - 10 * 60000,
      arrivalTime: now + 15 * 60000,
      status: "on_time",
      delay: 0,
      progress: 0.65,
      anomalies: [],
    },
    {
      id: "ICE-124",
      trainId: "DB-124",
      type: "ICE",
      from: getStation("ASD"),
      to: getStation("AH"),
      departureTime: now - 30 * 60000,
      arrivalTime: now + 45 * 60000,
      status: "running",
      delay: 3,
      progress: 0.55,
      anomalies: ["axle_mismatch"],
    },
    {
      id: "IC-3082",
      trainId: "NS-3082",
      type: "Intercity",
      from: getStation("EHV"),
      to: getStation("ASD"),
      departureTime: now - 50 * 60000,
      arrivalTime: now + 30 * 60000,
      status: "running",
      delay: 0,
      progress: 0.62,
      anomalies: [],
    },
    {
      id: "SPR-7744",
      trainId: "NS-7744",
      type: "Sprinter",
      from: getStation("HTN"),
      to: getStation("SHL"),
      departureTime: now - 5 * 60000,
      arrivalTime: now + 10 * 60000,
      status: "on_time",
      delay: 0,
      progress: 0.33,
      anomalies: [],
    },
    {
      id: "IC-9920",
      trainId: "NS-9920",
      type: "Intercity",
      from: getStation("RTD"),
      to: getStation("UT"),
      departureTime: now - 20 * 60000,
      arrivalTime: now + 25 * 60000,
      status: "delayed",
      delay: 12,
      progress: 0.44,
      anomalies: ["unsafe_switch"],
    },
    {
      id: "SPR-3310",
      trainId: "NS-3310",
      type: "Sprinter",
      from: getStation("DT"),
      to: getStation("RTD"),
      departureTime: now - 8 * 60000,
      arrivalTime: now + 12 * 60000,
      status: "on_time",
      delay: 0,
      progress: 0.5,
      anomalies: [],
    },
  ];

  // Calculate interpolated current positions
  return routes.map(r => {
    const lat = r.from.lat + (r.to.lat - r.from.lat) * r.progress;
    const lng = r.from.lng + (r.to.lng - r.from.lng) * r.progress;
    return { ...r, currentLat: lat, currentLng: lng };
  });
}

// Rail connections for drawing lines on map
export const railConnections: [string, string][] = [
  ["ASD", "SHL"],
  ["SHL", "LEDN"],
  ["LEDN", "GVC"],
  ["GVC", "DT"],
  ["DT", "RTD"],
  ["RTD", "BD"],
  ["BD", "EHV"],
  ["ASD", "HTN"],
  ["ASD", "AMD"],
  ["AMD", "UT"],
  ["UT", "AH"],
  ["AH", "NMG"],
  ["UT", "ZL"],
  ["ZL", "GN"],
  ["ZL", "LW"],
  ["EHV", "MT"],
  ["LEDN", "HTN"],
];
