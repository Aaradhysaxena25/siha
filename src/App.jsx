import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Cpu,
  Radio,
  Activity,
  Layers,
  Eye,
  EyeOff,
  Route as RouteIcon,
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Zap,
  Box,
  AlertTriangle,
  Wifi,
} from "lucide-react";
import { warehouseEnvironment } from "../data/environment.js";
import { distance } from "./lib/coords.js";
import WarehouseMap from "./components/WarehouseMap.jsx";
import AgentCard from "./components/AgentCard.jsx";
import TargetCard from "./components/TargetCard.jsx";
import ChargingStationCard from "./components/ChargingStationCard.jsx";
import StatsBar from "./components/StatsBar.jsx";

const env = warehouseEnvironment;

export default function App() {
  const [selectedAgentId, setSelectedAgentId] = useState("A01");
  const [showAlternative, setShowAlternative] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showObstacles, setShowObstacles] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [agents, setAgents] = useState(env.agents);
  const [eventLog, setEventLog] = useState([
    { time: "00:00:00", agent: "SYS", msg: "EdgeFleet command center initialized", type: "info" },
    { time: "00:00:01", agent: "SYS", msg: "4 agents online · 4 targets assigned", type: "info" },
    { time: "00:00:02", agent: "A01", msg: "Route RT01 activated → target T01", type: "route" },
  ]);

  const simTimeRef = useRef(0);
  const routeProgressRef = useRef({});

  // Find route for agent
  const getRoute = (agentId) => {
    return env.routes.find((r) => r.agentId === agentId && r.status === "ACTIVE");
  };

  // Simulation loop — move agents along their routes
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      simTimeRef.current += 0.1 * simSpeed;
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status !== "MOVING") return agent;
          const route = getRoute(agent.id);
          if (!route) return agent;

          const key = agent.id;
          if (routeProgressRef.current[key] === undefined) {
            routeProgressRef.current[key] = { segment: 0, progress: 0 };
          }
          const prog = routeProgressRef.current[key];

          if (prog.segment >= route.waypoints.length - 1) return agent;

          const from = route.waypoints[prog.segment];
          const to = route.waypoints[prog.segment + 1];
          const segDist = distance(from, to);
          const moveDist = agent.velocity * 0.1 * simSpeed;

          prog.progress += moveDist / segDist;

          if (prog.progress >= 1) {
            prog.segment += 1;
            prog.progress = 0;
            if (prog.segment >= route.waypoints.length - 1) {
              const finalWp = route.waypoints[route.waypoints.length - 1];
              addEvent(agent.id, `Reached target ${agent.targetId}`, "success");
              return {
                ...agent,
                x: finalWp.x,
                y: finalWp.y,
                status: "IDLE",
                velocity: 0,
              };
            }
          }

          const nextFrom = route.waypoints[prog.segment];
          const nextTo = route.waypoints[prog.segment + 1];
          const t = prog.progress;
          const newX = nextFrom.x + (nextTo.x - nextFrom.x) * t;
          const newY = nextFrom.y + (nextTo.y - nextFrom.y) * t;

          // Battery drain
          const batteryDrain = 0.05 * simSpeed;

          return {
            ...agent,
            x: newX,
            y: newY,
            battery: Math.max(0, agent.battery - batteryDrain),
          };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  const addEvent = (agent, msg, type = "info") => {
    const t = Math.floor(simTimeRef.current);
    const hh = String(Math.floor(t / 3600)).padStart(2, "0");
    const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const ss = String(t % 60).padStart(2, "0");
    setEventLog((prev) =>
      [{ time: `${hh}:${mm}:${ss}`, agent, msg, type }, ...prev].slice(0, 50)
    );
  };

  const handleReset = () => {
    setAgents(env.agents);
    routeProgressRef.current = {};
    simTimeRef.current = 0;
    setEventLog([
      { time: "00:00:00", agent: "SYS", msg: "Simulation reset", type: "warning" },
    ]);
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const selectedRoute = env.routes.find(
    (r) => r.agentId === selectedAgentId && r.status !== "ALTERNATIVE"
  );
  const altRoute = env.routes.find(
    (r) => r.agentId === selectedAgentId && r.status === "ALTERNATIVE"
  );

  const selectedTarget = env.targets.find((t) => t.id === selectedAgent?.targetId);
  const remainingDistance = useMemo(() => {
    if (!selectedAgent || !selectedRoute) return 0;
    let total = 0;
    for (let i = 0; i < selectedRoute.waypoints.length - 1; i++) {
      total += distance(selectedRoute.waypoints[i], selectedRoute.waypoints[i + 1]);
    }
    return total;
  }, [selectedAgent, selectedRoute]);

  const formatTime = (secs) => {
    const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
    const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const ss = String(Math.floor(secs % 60)).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-primary)" }}>
      {/* Top header bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: 56,
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-teal))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(0, 217, 255, 0.4)",
            }}
          >
            <Cpu size={18} color="var(--bg-primary)" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-bright)", letterSpacing: -0.3 }}>
              EdgeFleet AI
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
              COMMAND CENTER · {env.id}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Live status indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Wifi size={13} color="var(--accent-green)" />
            <span className="mono" style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              EDGE LINK
            </span>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-green)",
                animation: "blink 2s infinite",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Radio size={13} color="var(--accent-cyan)" />
            <span className="mono" style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              {agents.filter((a) => a.status !== "ERROR").length}/{agents.length} ONLINE
            </span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--accent-cyan)", fontWeight: 600 }}>
            T+{formatTime(simTimeRef.current)}
          </div>
        </div>
      </header>

      {/* Main body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left sidebar — agents */}
        <aside
          style={{
            width: 280,
            flexShrink: 0,
            background: "var(--bg-secondary)",
            borderRight: "1px solid var(--border)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Activity size={14} color="var(--accent-cyan)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: 1 }}>
                Fleet Agents
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 9,
                  color: "var(--accent-cyan)",
                  background: "rgba(0, 217, 255, 0.1)",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                {agents.length}
              </span>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
              />
            ))}
          </div>

          {/* Simulation controls */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid var(--border)",
              background: "var(--bg-tertiary)",
            }}
          >
            <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>
              Simulation
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  background: isSimulating ? "var(--bg-card)" : "var(--accent-cyan)",
                  color: isSimulating ? "var(--accent-cyan)" : "var(--bg-primary)",
                  border: `1px solid ${isSimulating ? "var(--accent-cyan)" : "transparent"}`,
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 600,
 fontFamily: "JetBrains Mono, monospace",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  transition: "all 0.2s",
                }}
              >
                {isSimulating ? <Pause size={12} /> : <Play size={12} />}
                {isSimulating ? "PAUSE" : "PLAY"}
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: "6px 10px",
                  background: "var(--bg-card)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "JetBrains Mono, monospace",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <RotateCcw size={12} />
                RESET
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--text-muted)" }}>SPEED</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: "var(--accent-cyan)" }}
              />
              <span className="mono" style={{ fontSize: 10, color: "var(--accent-cyan)", minWidth: 24 }}>
                {simSpeed}x
              </span>
            </div>
          </div>
        </aside>

        {/* Center — map */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Map toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>
                Digital Twin
              </span>
              <span className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {env.coordinateSystem.width} × {env.coordinateSystem.height} grid
              </span>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <ToolbarToggle active={showZones} onClick={() => setShowZones(!showZones)} icon={<Layers size={12} />} label="Zones" />
              <ToolbarToggle active={showObstacles} onClick={() => setShowObstacles(!showObstacles)} icon={<Box size={12} />} label="Obstacles" />
              <ToolbarToggle active={showRoutes} onClick={() => setShowRoutes(!showRoutes)} icon={<RouteIcon size={12} />} label="Routes" />
              <ToolbarToggle active={showAlternative} onClick={() => setShowAlternative(!showAlternative)} icon={<GitBranch size={12} />} label="Alt Path" />
            </div>
          </div>

          {/* Map canvas */}
          <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
            <WarehouseMap
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              showAlternative={showAlternative}
              showZones={showZones}
              showObstacles={showObstacles}
              showRoutes={showRoutes}
              liveAgents={agents}
            />
          </div>
        </main>

        {/* Right sidebar */}
        <aside
          style={{
            width: 300,
            flexShrink: 0,
            background: "var(--bg-secondary)",
            borderLeft: "1px solid var(--border)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Stats */}
          <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--border)" }}>
            <StatsBar agents={agents} targets={env.targets} routes={env.routes} />
          </div>

          {/* Selected agent details */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Selected Agent
            </div>
            {selectedAgent && (
              <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-sm)", padding: 12, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-cyan)" }}>
                    {selectedAgent.id}
                  </span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--text-muted)" }}>
                    → {selectedAgent.targetId}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 10 }}>
                  <DetailRow label="Status" value={selectedAgent.status} color="var(--accent-cyan)" />
                  <DetailRow label="Battery" value={`${Math.round(selectedAgent.battery)}%`} />
                  <DetailRow label="Velocity" value={`${selectedAgent.velocity.toFixed(1)} u/s`} />
                  <DetailRow label="Position" value={`${selectedAgent.x.toFixed(1)}, ${selectedAgent.y.toFixed(1)}`} />
                </div>
                {selectedRoute && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 4 }}>ROUTE DISTANCE</div>
                    <div className="mono" style={{ fontSize: 13, color: "var(--accent-cyan)", fontWeight: 600 }}>
                      {remainingDistance.toFixed(1)} units
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 6, marginBottom: 4 }}>WAYPOINTS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {selectedRoute.waypoints.map((wp, i) => (
                        <span
                          key={i}
                          className="mono"
                          style={{
                            fontSize: 8,
                            background: "var(--bg-tertiary)",
                            padding: "2px 5px",
                            borderRadius: 3,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {wp.x},{wp.y}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {altRoute && (
                  <div style={{ marginTop: 8, padding: 8, background: "rgba(168, 85, 247, 0.08)", borderRadius: 6, border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "var(--accent-purple)", fontWeight: 600 }}>
                      <GitBranch size={10} />
                      ALT ROUTE AVAILABLE
                    </div>
                    <div className="mono" style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>
                      {altRoute.waypoints.length} waypoints · backup path
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Targets */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <MapPin size={12} color="var(--accent-amber)" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: 1 }}>
                Targets
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {env.targets.map((t) => (
                <TargetCard key={t.id} target={t} />
              ))}
            </div>
          </div>

          {/* Charging stations */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Zap size={12} color="var(--accent-green)" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: 1 }}>
                Charging Stations
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {env.chargingStations.map((c) => (
                <ChargingStationCard key={c.id} station={c} />
              ))}
            </div>
          </div>

          {/* Event log */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "12px 14px 6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Activity size={12} color="var(--accent-cyan)" />
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: 1 }}>
                  Event Log
                </span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "4px 14px 12px" }}>
              {eventLog.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "4px 0",
                    fontSize: 9,
                    fontFamily: "JetBrains Mono, monospace",
                    borderBottom: i < eventLog.length - 1 ? "1px solid var(--border)" : "none",
                    animation: "slide-in 0.3s ease-out",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{e.time}</span>
                  <span
                    style={{
                      color:
                        e.type === "success"
                          ? "var(--accent-green)"
                          : e.type === "warning"
                          ? "var(--accent-amber)"
                          : e.type === "error"
                          ? "var(--accent-red)"
                          : e.type === "route"
                          ? "var(--accent-cyan)"
                          : "var(--text-secondary)",
                      flexShrink: 0,
                      width: 28,
                    }}
                  >
                    {e.agent}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{e.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToolbarToggle({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        background: active ? "rgba(0, 217, 255, 0.1)" : "var(--bg-card)",
        color: active ? "var(--accent-cyan)" : "var(--text-muted)",
        border: `1px solid ${active ? "var(--accent-cyan)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 600,
        fontFamily: "JetBrains Mono, monospace",
        transition: "all 0.2s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailRow({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 8, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 2 }}>
        {label}
      </div>
      <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: color || "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}
