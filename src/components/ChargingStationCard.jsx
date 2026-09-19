import React from "react";
import { Zap } from "lucide-react";
import { statusColors } from "../lib/coords.js";

export default function ChargingStationCard({ station }) {
  const color = statusColors[station.status] || "var(--accent-green)";
  const isAvailable = station.status === "AVAILABLE";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        fontSize: 10,
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: `${color}22`,
            border: `1px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: isAvailable ? "pulse-glow 2s infinite" : "none",
          }}
        >
          <Zap size={11} color={color} />
        </div>
        <div>
          <div className="mono" style={{ fontWeight: 700, color: "var(--text-bright)", fontSize: 11 }}>
            {station.id}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 9 }}>
            {station.x}, {station.y}
          </div>
        </div>
      </div>
      <div
        className="mono"
        style={{
          color,
          fontSize: 8,
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        {station.status}
      </div>
    </div>
  );
}
