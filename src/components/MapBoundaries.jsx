import React from "react";
import { toSvgX, toSvgY } from "../lib/coords.js";

export default function MapBoundaries({ boundaries, scale, envHeight }) {
  return (
    <g className="boundaries-layer">
      {boundaries.map((b) => {
        const x = toSvgX(b.x, scale);
        const y = toSvgY(b.y, scale, envHeight) - b.height * scale;
        const w = b.width * scale;
        const h = b.height * scale;
        const isExternal = b.type === "wall";

        return (
          <rect
            key={b.id}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={isExternal ? "var(--color-wall)" : "var(--color-internal-wall)"}
            fillOpacity={isExternal ? 1 : 0.8}
            stroke={isExternal ? "#5a6a7e" : "#3a4a5e"}
            strokeWidth={isExternal ? 0.5 : 0}
            rx={isExternal ? 0 : 1}
          />
        );
      })}
    </g>
  );
}
