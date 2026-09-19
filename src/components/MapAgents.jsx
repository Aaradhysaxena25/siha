import React from "react";
import { toSvgX, toSvgY, statusColors } from "../lib/coords.js";

export default function MapAgents({ agents, scale, envHeight, selectedId, onSelect }) {
  return (
    <g className="agents-layer">
      {agents.map((agent) => {
        const cx = toSvgX(agent.x, scale);
        const cy = toSvgY(agent.y, scale, envHeight);
        const color = statusColors[agent.status] || "var(--accent-cyan)";
        const isSelected = selectedId === agent.id;
        const isMoving = agent.status === "MOVING";

        return (
          <g
            key={agent.id}
            style={{ cursor: "pointer", animation: "fade-in 0.5s ease-out" }}
            onClick={() => onSelect?.(agent.id)}
          >
            {/* Detection range ring (only for moving agents) */}
            {isMoving && (
              <circle
                cx={cx}
                cy={cy}
                r={10}
                fill="none"
                stroke={color}
                strokeWidth={0.4}
                strokeOpacity={0.2}
                strokeDasharray="2 3"
              />
            )}

            {/* Selection highlight */}
            {isSelected && (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                opacity={0.8}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  animation: "pulse-ring 1.5s ease-out infinite",
                }}
              />
            )}

            {/* Glow halo */}
            <circle
              cx={cx}
              cy={cy}
              r={4}
              fill={color}
              fillOpacity={0.15}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                animation: isMoving ? "pulse-glow 1.5s ease-in-out infinite" : "none",
              }}
            />

            {/* Agent body — triangle pointing in direction of movement */}
            <circle
              cx={cx}
              cy={cy}
              r={2.5}
              fill={color}
              stroke="var(--bg-primary)"
              strokeWidth={0.8}
            />

            {/* Inner dot */}
            <circle cx={cx} cy={cy} r={1} fill="var(--bg-primary)" />

            {/* Agent label */}
            <g transform={`translate(${cx + 5}, ${cy - 5})`}>
              <rect
                x={0}
                y={-4}
                width={14}
                height={7}
                fill="var(--bg-card)"
                fillOpacity={0.9}
                stroke={color}
                strokeWidth={0.4}
                rx={2}
              />
              <text
                x={7}
                y={1}
                fill={color}
                fontSize={4.5}
                fontFamily="JetBrains Mono, monospace"
                fontWeight={700}
                textAnchor="middle"
              >
                {agent.id}
              </text>
            </g>

            {/* Battery indicator */}
            <g transform={`translate(${cx + 5}, ${cy + 3})`}>
              <rect
                x={0}
                y={0}
                width={12}
                height={3}
                fill="var(--bg-card)"
                fillOpacity={0.9}
                stroke="var(--border-light)"
                strokeWidth={0.3}
                rx={1}
              />
              <rect
                x={0.5}
                y={0.5}
                width={(agent.battery / 100) * 11}
                height={2}
                fill={
                  agent.battery > 60
                    ? "var(--accent-green)"
                    : agent.battery > 30
                    ? "var(--accent-amber)"
                    : "var(--accent-red)"
                }
                rx={0.5}
              />
              <text
                x={14}
                y={2.5}
                fill="var(--text-muted)"
                fontSize={3.5}
                fontFamily="JetBrains Mono, monospace"
              >
                {Math.round(agent.battery)}%
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
