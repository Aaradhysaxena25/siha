import React from "react";
import { toSvgX, toSvgY } from "../lib/coords.js";

export default function MapObstacles({ obstacles, scale, envHeight }) {
  return (
    <g className="obstacles-layer">
      {obstacles.map((o) => {
        const x = toSvgX(o.x, scale);
        const y = toSvgY(o.y, scale, envHeight) - o.height * scale;
        const w = o.width * scale;
        const h = o.height * scale;
        const isRack = o.type === "storage_rack";

        return (
          <g key={o.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={isRack ? "var(--color-rack)" : "var(--color-obstacle)"}
              fillOpacity={isRack ? 0.85 : 0.7}
              stroke={isRack ? "#6a7a8e" : "#8a6a4a"}
              strokeWidth={0.5}
              rx={isRack ? 1 : 2}
            />
            {isRack && (
              <>
                <line
                  x1={x}
                  y1={y + h / 3}
                  x2={x + w}
                  y2={y + h / 3}
                  stroke="#5a6a7e"
                  strokeWidth={0.3}
                  opacity={0.6}
                />
                <line
                  x1={x}
                  y1={y + (h * 2) / 3}
                  x2={x + w}
                  y2={y + (h * 2) / 3}
                  stroke="#5a6a7e"
                  strokeWidth={0.3}
                  opacity={0.6}
                />
              </>
            )}
            <text
              x={x + w / 2}
              y={y + h / 2 + 2}
              fill="#e0e8f0"
              fontSize={5}
              fontFamily="JetBrains Mono, monospace"
              textAnchor="middle"
              opacity={0.6}
            >
              {o.id}
            </text>
          </g>
        );
      })}
    </g>
  );
}
