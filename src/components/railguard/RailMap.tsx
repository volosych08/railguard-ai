import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrainRoute } from "@/lib/railguard/types";
import { stations, railConnections, getStation } from "@/lib/railguard/stations";
import { cn } from "@/lib/utils";

interface Props {
  routes: TrainRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

// Custom station icon
function stationIcon(hasAnomaly: boolean) {
  return L.divIcon({
    className: "custom-station-icon",
    html: `<div style="
      width: 10px; height: 10px; 
      border-radius: 50%; 
      background: ${hasAnomaly ? "hsl(0 72% 55%)" : "hsl(210 100% 56%)"}; 
      border: 2px solid hsl(225 14% 9%);
      box-shadow: 0 0 8px ${hasAnomaly ? "hsl(0 72% 55% / 0.5)" : "hsl(210 100% 56% / 0.4)"};
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

// Custom train icon
function trainIcon(route: TrainRoute, isSelected: boolean) {
  const hasAnomaly = route.anomalies.length > 0;
  const color = hasAnomaly ? "hsl(0 72% 55%)" : route.status === "delayed" ? "hsl(38 95% 55%)" : "hsl(155 65% 45%)";
  const size = isSelected ? 18 : 14;
  return L.divIcon({
    className: "custom-train-icon",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 4px;
      transform: rotate(45deg);
      border: 2px solid hsl(225 14% 9%);
      box-shadow: 0 0 12px ${color.replace(")", " / 0.6)")};
      ${isSelected ? "animation: pulse 1.5s infinite;" : ""}
    "></div>
    <style>@keyframes pulse { 0%, 100% { transform: rotate(45deg) scale(1); } 50% { transform: rotate(45deg) scale(1.3); } }</style>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    // Fit to Netherlands bounds
    map.fitBounds([[50.7, 3.3], [53.6, 7.3]], { padding: [30, 30] });
  }, [map]);
  return null;
}

export default function RailMap({ routes, selectedRouteId, onSelectRoute }: Props) {
  // Stations with anomalies
  const anomalyStations = new Set<string>();
  routes.forEach(r => {
    if (r.anomalies.length > 0) {
      anomalyStations.add(r.from.id);
      anomalyStations.add(r.to.id);
    }
  });

  // Rail lines
  const lines = railConnections.map(([a, b]) => {
    const sa = getStation(a);
    const sb = getStation(b);
    return [[sa.lat, sa.lng], [sb.lat, sb.lng]] as [number, number][];
  });

  return (
    <MapContainer
      center={[52.1, 5.3]}
      zoom={8}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={true}
    >
      <FitBounds />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Rail lines */}
      {lines.map((line, i) => (
        <Polyline
          key={`rail-${i}`}
          positions={line}
          pathOptions={{
            color: "hsl(210 100% 56%)",
            weight: 1.5,
            opacity: 0.2,
            dashArray: "6, 8",
          }}
        />
      ))}

      {/* Active route lines */}
      {routes.map(route => (
        <Polyline
          key={`route-${route.id}`}
          positions={[
            [route.from.lat, route.from.lng],
            [route.to.lat, route.to.lng],
          ]}
          pathOptions={{
            color: route.anomalies.length > 0
              ? "hsl(0 72% 55%)"
              : route.id === selectedRouteId
                ? "hsl(210 100% 56%)"
                : "hsl(155 65% 45%)",
            weight: route.id === selectedRouteId ? 3 : 2,
            opacity: route.id === selectedRouteId ? 0.8 : 0.4,
          }}
          eventHandlers={{ click: () => onSelectRoute(route.id) }}
        />
      ))}

      {/* Station markers */}
      {stations.map(station => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={stationIcon(anomalyStations.has(station.id))}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold">{station.name}</div>
              <div className="text-xs opacity-70">{station.id}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Train markers */}
      {routes.map(route => route.currentLat && route.currentLng && (
        <Marker
          key={`train-${route.id}`}
          position={[route.currentLat, route.currentLng]}
          icon={trainIcon(route, route.id === selectedRouteId)}
          eventHandlers={{ click: () => onSelectRoute(route.id) }}
        >
          <Popup>
            <div className="text-sm min-w-[160px]">
              <div className="font-bold text-base">{route.id}</div>
              <div className="opacity-70 text-xs mt-1">{route.type} · {route.trainId}</div>
              <div className="mt-2 text-xs">
                <span className="opacity-50">From:</span> {route.from.name}
              </div>
              <div className="text-xs">
                <span className="opacity-50">To:</span> {route.to.name}
              </div>
              {route.delay > 0 && (
                <div className="mt-1 text-xs" style={{ color: "hsl(38 95% 55%)" }}>
                  +{route.delay} min delayed
                </div>
              )}
              {route.anomalies.length > 0 && (
                <div className="mt-1 text-xs" style={{ color: "hsl(0 72% 55%)" }}>
                  ⚠ {route.anomalies.length} anomal{route.anomalies.length > 1 ? "ies" : "y"}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
