import React from "react";
import { toSvgX, toSvgY, statusColors } from "../lib/coords.js";

export default function MapTargets({ targets, scale, envHeight }) {
  return (
    <g className="targets-layer">
      {targets.map((t) => {
        const cx = toSvgX(t.x, scale);
        const cy = toSvgY(t.y, scale, envHeight);
        const color = statusColors[t.status] || "var(--accent-amber)";
        const isDelivery = t.type === "DELIVERY";

        return (
          <g key={t.id} style={{ animation: "fade-in 0.4s ease-out" }}>
            {/* Outer pulse ring */}
            <circle
              cx={cx}
              cy={cy}
              r={4}
              fill="none"
              stroke={color}
              strokeWidth={0.8}
              opacity={0.5}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                animation: "pulse-ring 2s ease-out infinite",
              }}
            />
            {/* Inner ring */}
            <circle
              cx={cx}
              cy={cy}
              r={3}
              fill="none"
              stroke={color}
              strokeWidth={1}
              opacity={0.7}
            />
            {/* Cross marker */}
            <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke={color} strokeWidth={0.8} />
            <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke={color} strokeWidth={0.8} />
            {/* Center dot */}
            <circle cx={cx} cy={cy} r={1.5} fill={color} />

            <text
              x={cx + 6}
              y={cy - 4}
              fill={color}
              fontSize={5}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={600}
              opacity={0.9}
            >
              {t.id}
            </text>
            <text
              x={cx + 6}
              y={cy + 2}
              fill="var(--text-muted)"
              fontSize={4}
              fontFamily="JetBrains Mono, monospace"
              opacity={0.6}
            >
              {isDelivery ? "DEL" : "PICK"}
            </text>
          </g>
        );
      })}
    </g>
  );
}
