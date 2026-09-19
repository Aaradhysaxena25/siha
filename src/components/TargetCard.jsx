import React from "react";
import { statusColors } from "../lib/coords.js";

export default function TargetCard({ target, agentId }) {
  const color = statusColors[target.status] || "var(--accent-amber)";
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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            border: `1.5px solid ${color}`,
            borderRadius: "50%",
          }}
        />
        <div>
          <div className="mono" style={{ fontWeight: 700, color: "var(--text-bright)", fontSize: 11 }}>
            {target.id}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 9 }}>
            {target.type}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="mono" style={{ color: "var(--text-secondary)", fontSize: 10 }}>
          {target.x}, {target.y}
        </div>
        <div
          className="mono"
          style={{ color, fontSize: 8, textTransform: "uppercase", fontWeight: 600 }}
        >
          {target.status}
        </div>
      </div>
    </div>
  );
}
