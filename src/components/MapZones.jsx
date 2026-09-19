import React from "react";
import {
  zoneColors,
  zoneBorderColors,
  zoneLabelColors,
  toSvgX,
  toSvgY,
} from "../lib/coords.js";

export default function MapZones({ zones, scale, envHeight }) {
  return (
    <g className="zones-layer">
      {zones.map((zone) => {
        const x = toSvgX(zone.x, scale);
        const y = toSvgY(zone.y, scale, envHeight) - zone.height * scale;
        const w = zone.width * scale;
        const h = zone.height * scale;
        const isRestricted = zone.type === "RESTRICTED";

        return (
          <g key={zone.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={zoneColors[zone.type] || "var(--bg-tertiary)"}
              fillOpacity={0.35}
              stroke={zoneBorderColors[zone.type] || "var(--border-light)"}
              strokeWidth={isRestricted ? 1.5 : 1}
              strokeDasharray={isRestricted ? "4 3" : "2 4"}
              rx={2}
            />
            {isRestricted && (
              <>
                <line x1={x} y1={y} x2={x + w} y2={y + h} stroke="#a83b3b" strokeWidth={0.5} strokeOpacity={0.3} />
                <line x1={x + w} y1={y} x2={x} y2={y + h} stroke="#a83b3b" strokeWidth={0.5} strokeOpacity={0.3} />
              </>
            )}
            <text
              x={x + 6}
              y={y + 14}
              fill={zoneLabelColors[zone.type] || "var(--text-secondary)"}
              fontSize={9}
              fontFamily="JetBrains Mono, monospace"
              fontWeight={500}
              opacity={0.7}
            >
              {zone.name}
            </text>
            <text
              x={x + 6}
              y={y + 24}
              fill={zoneLabelColors[zone.type] || "var(--text-secondary)"}
              fontSize={6}
              fontFamily="JetBrains Mono, monospace"
              opacity={0.4}
            >
              {zone.type}
            </text>
          </g>
        );
      })}
    </g>
  );
}
