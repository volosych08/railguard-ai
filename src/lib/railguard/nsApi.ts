/**
 * NS Reisinformatie API Service
 * Fetches real-time train data from Nederlandse Spoorwegen
 */

const NS_API_BASE = import.meta.env.DEV
  ? "/api/reisinformatie" // Use local proxy in development
  : "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2"; // Direct API in production
const NS_API_KEY_PRIMARY = import.meta.env.VITE_NS_API_KEY_PRIMARY || "4049f5955f2347529935f75ca322bde8";
const NS_API_KEY_SECONDARY = import.meta.env.VITE_NS_API_KEY_SECONDARY || "3640e9b13df64896add11efa21bc0e29";

let activeApiKey = NS_API_KEY_PRIMARY;

console.log("[NS API] Base URL:", NS_API_BASE);
console.log("[NS API] Primary Key loaded:", !!NS_API_KEY_PRIMARY);
console.log("[NS API] Secondary Key loaded:", !!NS_API_KEY_SECONDARY);

/**
 * Fetch with automatic failover between primary and secondary API keys
 */
async function fetchWithFailover(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    console.log(`[NS API] Fetching: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        "Ocp-Apim-Subscription-Key": activeApiKey,
      },
    });

    console.log(`[NS API] Response: ${response.status} ${response.statusText}`);

    // If primary key works, keep using it
    if (response.ok) {
      return response;
    }

    // If primary key fails with auth error and secondary exists, try secondary
    if (response.status === 401 && NS_API_KEY_SECONDARY) {
      console.log("[NS API] Primary key failed (401), trying secondary key...");
      activeApiKey = NS_API_KEY_SECONDARY;

      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          "Ocp-Apim-Subscription-Key": activeApiKey,
        },
      });
    }

    return response;
  } catch (error) {
    console.log("[NS API] Fetch error:", error);
    // Network error, try secondary key if primary failed
    if (NS_API_KEY_SECONDARY && activeApiKey === NS_API_KEY_PRIMARY) {
      console.log("[NS API] Retrying with secondary key after network error...");
      activeApiKey = NS_API_KEY_SECONDARY;

      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          "Ocp-Apim-Subscription-Key": activeApiKey,
        },
      });
    }

    throw error;
  }
}

/**
 * Get current active API key (for debugging)
 */
export function getActiveApiKey(): string {
  return activeApiKey === NS_API_KEY_PRIMARY ? "PRIMARY" : "SECONDARY";
}

export interface NSArrival {
  id: string;
  trainType: string;
  trainNumber: string;
  operator: string;
  status: string;
  actualArrivalTime?: string;
  plannedArrivalTime: string;
  actualDepartureTime?: string;
  plannedDepartureTime: string;
  platform?: string;
  route: {
    stations: Array<{
      name: string;
      uicCode?: string;
      stationType?: string;
    }>;
  };
  delay?: number;
}

/**
 * Fetch train arrivals for a specific station
 * @param stationUicCode - UIC code of the station (e.g., "8400058" for Amsterdam)
 * @param options - Optional parameters
 */
export async function getTrainArrivals(
  stationUicCode: string,
  options?: {
    lang?: string;        // Language for response (nl, en, de, fr)
    station?: string;     // Station name as alternative to uicCode
    dateTime?: string;    // ISO datetime for query (RFC3339)
    maxJourneys?: number; // Maximum number of journeys to return
  }
): Promise<NSArrival[]> {
  const params = new URLSearchParams();
  
  // Add required parameters
  if (stationUicCode) {
    params.append("uicCode", stationUicCode);
  } else if (options?.station) {
    params.append("station", options.station);
  }
  
  // Add optional parameters
  if (options?.lang) {
    params.append("lang", options.lang);
  }
  if (options?.dateTime) {
    params.append("dateTime", options.dateTime);
  }
  if (options?.maxJourneys) {
    params.append("maxJourneys", String(options.maxJourneys));
  }

  try {
    const response = await fetchWithFailover(
      `${NS_API_BASE}/arrivals?${params.toString()}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Silently fail - mock data fallback will be used
      return [];
    }

    const data = await response.json();
    console.log("[NS API] Arrivals raw data:", data);
    return data.payload?.arrivals || [];
  } catch (error) {
    // Silently fail - mock data fallback will be used
    return [];
  }
}

/**
 * Fetch train departures for a specific station
 * @param stationUicCode - UIC code of the station (e.g., "8400058" for Amsterdam)
 * @param options - Optional parameters
 */
export async function getTrainDepartures(
  stationUicCode: string,
  options?: {
    lang?: string;        // Language for response (nl, en, de, fr)
    station?: string;     // Station name as alternative to uicCode
    dateTime?: string;    // ISO datetime for query (RFC3339)
    maxJourneys?: number; // Maximum number of journeys to return
  }
): Promise<NSArrival[]> {
  const params = new URLSearchParams();
  
  // Add required parameters
  if (stationUicCode) {
    params.append("uicCode", stationUicCode);
  } else if (options?.station) {
    params.append("station", options.station);
  }
  
  // Add optional parameters
  if (options?.lang) {
    params.append("lang", options.lang);
  }
  if (options?.dateTime) {
    params.append("dateTime", options.dateTime);
  }
  if (options?.maxJourneys) {
    params.append("maxJourneys", String(options.maxJourneys));
  }

  try {
    const response = await fetchWithFailover(
      `${NS_API_BASE}/departures?${params.toString()}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Silently fail - mock data fallback will be used
      return [];
    }

    const data = await response.json();
    console.log("[NS API] Departures raw data:", data);
    return data.payload?.departures || [];
  } catch (error) {
    // Silently fail - mock data fallback will be used
    return [];
  }
}

/**
 * Get all stations with their UIC codes
 */
export async function getStations(): Promise<
  Array<{
    name: string;
    uicCode: string;
    lat: number;
    lng: number;
  }>
> {
  try {
    const response = await fetchWithFailover(`${NS_API_BASE}/stations`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`NS API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    return [];
  }
}

/**
 * Calculate delay in minutes from actual vs planned arrival/departure
 */
export function calculateDelay(
  planned: string,
  actual?: string
): number {
  if (!actual) return 0;

  const plannedTime = new Date(planned).getTime();
  const actualTime = new Date(actual).getTime();
  return Math.round((actualTime - plannedTime) / 60000); // Convert to minutes
}

/**
 * Determine train status based on actual times
 */
export function getTrainStatus(
  arrival: NSArrival
): "on_time" | "delayed" | "cancelled" | "running" {
  if (arrival.status === "CANCELLED") return "cancelled";

  const delay = arrival.delay || 0;
  if (delay > 5) return "delayed";
  if (delay > 0) return "running";

  return "on_time";
}
