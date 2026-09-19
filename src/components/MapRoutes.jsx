import React from "react";
import { toSvgX, toSvgY, statusColors } from "../lib/coords.js";

export default function MapRoutes({ routes, scale, envHeight, showAlternative }) {
  return (
    <g className="routes-layer">
      {routes
        .filter((r) => showAlternative || r.status !== "ALTERNATIVE")
        .map((route) => {
          const points = route.waypoints.map((wp) =>
            `${toSvgX(wp.x, scale)},${toSvgY(wp.y, scale, envHeight)}`
          );
          const pathD = points.join(" L ");
          const color = statusColors[route.status] || "var(--accent-cyan)";
          const isAlternative = route.status === "ALTERNATIVE";
          const isActive = route.status === "ACTIVE";

          return (
            <g key={route.id}>
              <path
                d={`M ${pathD}`}
                fill="none"
                stroke={color}
                strokeWidth={isAlternative ? 1 : 1.5}
                strokeOpacity={isAlternative ? 0.5 : 0.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={isAlternative ? "5 4" : isActive ? "6 3" : "3 3"}
                style={{
                  animation: isActive ? "dash-flow 1s linear infinite" : "none",
                }}
              />
              {/* Waypoint dots */}
              {route.waypoints.map((wp, i) => {
                const wx = toSvgX(wp.x, scale);
                const wy = toSvgY(wp.y, scale, envHeight);
                const isFirst = i === 0;
                const isLast = i === route.waypoints.length - 1;
                return (
                  <circle
                    key={i}
                    cx={wx}
                    cy={wy}
                    r={isFirst || isLast ? 2.5 : 1.5}
                    fill={color}
                    fillOpacity={isFirst || isLast ? 1 : 0.6}
                    stroke={isFirst || isLast ? "var(--bg-primary)" : "none"}
                    strokeWidth={0.5}
                  />
                );
              })}
            </g>
          );
        })}
    </g>
  );
}
