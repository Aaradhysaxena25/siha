import React from "react";
import { toSvgX, toSvgY, statusColors } from "../lib/coords.js";

export default function MapChargingStations({ stations, scale, envHeight }) {
  return (
    <g className="charging-layer">
      {stations.map((c) => {
        const cx = toSvgX(c.x + c.width / 2, scale);
        const cy = toSvgY(c.y + c.height / 2, scale, envHeight);
        const w = c.width * scale;
        const h = c.height * scale;
        const x = toSvgX(c.x, scale);
        const y = toSvgY(c.y, scale, envHeight) - h;
        const isAvailable = c.status === "AVAILABLE";
        const color = statusColors[c.status] || "var(--accent-green)";

        return (
          <g key={c.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill="var(--color-charging)"
              fillOpacity={0.25}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="3 2"
              rx={3}
            />
            {/* Lightning bolt icon */}
            <path
              d={`M ${cx} ${cy - h * 0.3} L ${cx - w * 0.15} ${cy} L ${cx} ${cy} L ${cx + w * 0.15} ${cy + h * 0.3} L ${cx - w * 0.05} ${cy + h * 0.05} L ${cx + w * 0.05} ${cy + h * 0.05} Z`}
              fill={color}
              opacity={0.9}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                animation: isAvailable ? "pulse-glow 2s ease-in-out infinite" : "none",
              }}
            />
            <text
              x={cx}
              y={y + h + 8}
              fill={color}
              fontSize={5}
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle"
              opacity={0.8}
            >
              {c.id}
            </text>
          </g>
        );
      })}
    </g>
  );
}
