import React from "react";
import { Activity, MapPin, Route as RouteIcon } from "lucide-react";
import { statusColors } from "../lib/coords.js";
import { distance } from "../lib/coords.js";

function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 12px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ color: color || "var(--accent-cyan)" }}>{icon}</span>
        <span
          style={{
            fontSize: 9,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="mono"
        style={{ fontSize: 18, fontWeight: 700, color: color || "var(--text-bright)" }}
      >
        {value}
      </div>
    </div>
  );
}

export default function StatsBar({ agents, targets, routes }) {
  const movingAgents = agents.filter((a) => a.status === "MOVING").length;
  const idleAgents = agents.filter((a) => a.status === "IDLE").length;
  const chargingAgents = agents.filter((a) => a.status === "CHARGING").length;
  const activeRoutes = routes.filter((r) => r.status === "ACTIVE").length;
  const pendingTargets = targets.filter((t) => t.status === "PENDING").length;
  const avgBattery = agents.reduce((sum, a) => sum + a.battery, 0) / agents.length;

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <StatCard
        icon={<Activity size={13} />}
        label="Active Agents"
        value={movingAgents}
        color="var(--accent-cyan)"
      />
      <StatCard
        icon={<Activity size={13} />}
        label="Idle"
        value={idleAgents}
        color="var(--accent-amber)"
      />
      <StatCard
        icon={<Activity size={13} />}
        label="Charging"
        value={chargingAgents}
        color="var(--accent-green)"
      />
      <StatCard
        icon={<RouteIcon size={13} />}
        label="Active Routes"
        value={activeRoutes}
        color="var(--accent-cyan)"
      />
      <StatCard
        icon={<MapPin size={13} />}
        label="Pending Targets"
        value={pendingTargets}
        color="var(--accent-amber)"
      />
      <StatCard
        icon={<Activity size={13} />}
        label="Avg Battery"
        value={`${Math.round(avgBattery)}%`}
        color={avgBattery > 60 ? "var(--accent-green)" : "var(--accent-amber)"}
      />
    </div>
  );
}
