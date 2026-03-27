#CLONE THIS CODE AND RUN LOCALY BECASUE GITHUB PAGES DON'T WORK

## 📊 Project Overview: **RailGuard AI**

This is a **Live Dutch Railway Monitoring Dashboard** built with modern web technologies. Here's what it does:

### 🎯 **Core Purpose**
Real-time monitoring and anomaly detection system for Dutch train networks (Nederlandse Spoorwegen - NS), displaying live train positions, delays, and AI-powered safety alerts.

### 🚀 **Key Features**

1. **Live Train Tracking** (Index.tsx, stations.ts)
   - Integrates with **NS Reisinformatie API** for real-time train departures and arrivals
   - Shows live train positions on an interactive map
   - Displays train status: on-time, delayed, cancelled, running

2. **Interactive Map** (RailMap.tsx)
   - Leaflet-based map of Dutch railways
   - Shows 17 major stations with train positions
   - Real-time train movement animations

3. **Train List & Details** (TrainList.tsx, DetailPanel.tsx)
   - Shows all active trains on a vertical list
   - Click-to-select train details panel
   - Route information: origin, destination, progress, delays

4. **Anomaly Detection Engine** (engine.ts)
   - Processes raw sensor data from rail networks
   - Detects anomalies: ghost trains, axle mismatches, unsafe switches, sensor conflicts
   - AI-powered severity classification (critical, warning, info)
   - Sensor health monitoring

5. **Statistics & Health Monitoring**
   - `StatsBar.tsx`: Total trains, delays, anomalies count
   - `SensorHealthBar.tsx`: Sensor reliability tracking
   - Live update indicators

6. **UI Components** (ui)
   - Built with **shadcn/ui** (Radix UI + Tailwind CSS)
   - Dark theme with glassmorphism effects
   - 30+ reusable components: dialogs, modals, dropdowns, alerts, etc.

### 🔧 **Tech Stack**
- **Frontend**: React 18.3 + TypeScript
- **Build**: Vite 5.4
- **Styling**: Tailwind CSS + custom dark theme
- **Map**: Leaflet + react-leaflet v4
- **UI**: shadcn/ui (Radix primitives)
- **Forms**: React Hook Form + Zod validation
- **API**: NS Reisinformatie API (proxied through Vite)
- **Testing**: Vitest + Playwright
- **Server**: Dev server on port 8081

### 🌍 **Data Sources**
- **Primary**: Nederlandse Spoorwegen (NS) live API for real train data
- **Fallback**: Comprehensive mock data (8 realistic trains with delays)
- **Sensor Data**: Simulated rail network sensors (camera, axle, switch, weight, vibration)

### 📍 **Coverage**
Tracks trains across major Dutch cities:
- Amsterdam, Utrecht, Rotterdam, Den Haag, Eindhoven, Arnhem, Groningen, Zwolle, and more

### ✨ **Current Status**
- ✅ UI fully functional with live map and train tracking
- ✅ Live API integration enabled with real NS data
- ✅ Anomaly detection engine working
- ✅ Real-time updates every 30 seconds
- 🟢 **Production-ready** (running on http://localhost:8081/)

**In essence**: This is a Hackathon project to build a **production-grade railway monitoring platform** that gives real-time visibility into Dutch train movements and safety anomalies. 🚂✨
