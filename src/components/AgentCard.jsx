import React from "react";
import { Battery, Navigation, Radio, Zap } from "lucide-react";
import { statusColors } from "../lib/coords.js";

export default function AgentCard({ agent, isSelected, onClick }) {
  const color = statusColors[agent.status] || "var(--accent-cyan)";
  const batteryColor =
    agent.battery > 60
      ? "var(--accent-green)"
      : agent.battery > 30
      ? "var(--accent-amber)"
      : "var(--accent-red)";

  const statusIcon = {
    MOVING: <Navigation size={11} />,
    IDLE: <Radio size={11} />,
    CHARGING: <Zap size={11} />,
    ERROR: <Radio size={11} />,
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? "var(--bg-elevated)" : "var(--bg-card)",
        border: isSelected
          ? `1px solid ${color}`
          : "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected ? `0 0 16px ${color}22` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px ${color}`,
              animation: agent.status === "MOVING" ? "pulse-glow 1.5s infinite" : "none",
            }}
          />
          <span
            className="mono"
            style={{ fontSize: 13, fontWeight: 700, color: "var(--text-bright)" }}
          >
            {agent.id}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 9,
            fontFamily: "JetBrains Mono, monospace",
            color: color,
            textTransform: "uppercase",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {statusIcon[agent.status]}
          {agent.status}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px", fontSize: 10 }}>
        <div>
          <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>POSITION</div>
          <div className="mono" style={{ color: "var(--text-primary)" }}>
            {agent.x.toFixed(1)}, {agent.y.toFixed(1)}
          </div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>VELOCITY</div>
          <div className="mono" style={{ color: "var(--text-primary)" }}>
            {agent.velocity.toFixed(1)} u/s
          </div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>TARGET</div>
          <div className="mono" style={{ color: "var(--accent-amber)" }}>
            {agent.targetId}
          </div>
        </div>
        <div>
          <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>BATTERY</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Battery size={11} color={batteryColor} />
            <span className="mono" style={{ color: batteryColor, fontWeight: 600 }}>
              {Math.round(agent.battery)}%
            </span>
          </div>
        </div>
      </div>

      {/* Battery bar */}
      <div
        style={{
          marginTop: 8,
          height: 3,
          background: "var(--bg-secondary)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${agent.battery}%`,
            height: "100%",
            background: batteryColor,
            borderRadius: 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
