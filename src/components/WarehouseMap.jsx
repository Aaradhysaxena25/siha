import React, { useRef, useEffect, useState } from "react";
import { warehouseEnvironment } from "../../data/environment.js";
import { getScale, getOffset, toSvgX, toSvgY } from "../lib/coords.js";
import MapZones from "./MapZones.jsx";
import MapBoundaries from "./MapBoundaries.jsx";
import MapObstacles from "./MapObstacles.jsx";
import MapChargingStations from "./MapChargingStations.jsx";
import MapTargets from "./MapTargets.jsx";
import MapRoutes from "./MapRoutes.jsx";
import MapAgents from "./MapAgents.jsx";

export default function WarehouseMap({
  selectedAgentId,
  onSelectAgent,
  showAlternative,
  showZones = true,
  showObstacles = true,
  showRoutes = true,
  showLabels = true,
  liveAgents,
}) {
  const containerRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 800, height: 600 });
  const [mouseCoord, setMouseCoord] = useState(null);

  const env = warehouseEnvironment;
  const envWidth = env.coordinateSystem.width;
  const envHeight = env.coordinateSystem.height;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const scale = getScale(viewport.width, viewport.height, envWidth, envHeight);
  const offset = getOffset(scale, viewport.width, viewport.height, envWidth, envHeight);

  const agents = liveAgents || env.agents;

  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * viewport.width;
    const svgY = ((e.clientY - rect.top) / rect.height) * viewport.height;
    const envX = (svgX - offset.x) / scale;
    const envY = envHeight - (svgY - offset.y) / scale;
    if (envX >= 0 && envX <= envWidth && envY >= 0 && envY <= envHeight) {
      setMouseCoord({ x: envX.toFixed(1), y: envY.toFixed(1) });
    } else {
      setMouseCoord(null);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at center, #0c1218 0%, #060a0e 100%)",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: `${scale * 5}px ${scale * 5}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
      />

      {/* Scan line effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent)",
            animation: "scan-line 8s linear infinite",
          }}
        />
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseCoord(null)}
        style={{ display: "block" }}
      >
        <g transform={`translate(${offset.x}, ${offset.y})`}>
          {/* Warehouse floor outline */}
          <rect
            x={0}
            y={0}
            width={envWidth * scale}
            height={envHeight * scale}
            fill="var(--bg-tertiary)"
            fillOpacity={0.3}
            stroke="var(--accent-cyan)"
            strokeWidth={1}
            strokeOpacity={0.15}
            rx={2}
          />

          {showZones && <MapZones zones={env.zones} scale={scale} envHeight={envHeight} />}
          <MapBoundaries boundaries={env.boundaries} scale={scale} envHeight={envHeight} />
          {showObstacles && <MapObstacles obstacles={env.obstacles} scale={scale} envHeight={envHeight} />}
          <MapChargingStations stations={env.chargingStations} scale={scale} envHeight={envHeight} />
          {showRoutes && (
            <MapRoutes
              routes={env.routes}
              scale={scale}
              envHeight={envHeight}
              showAlternative={showAlternative}
            />
          )}
          <MapTargets targets={env.targets} scale={scale} envHeight={envHeight} />
          <MapAgents
            agents={agents}
            scale={scale}
            envHeight={envHeight}
            selectedId={selectedAgentId}
            onSelect={onSelectAgent}
          />
        </g>
      </svg>

      {/* Coordinate display */}
      {mouseCoord && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 10px",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            color: "var(--accent-cyan)",
            pointerEvents: "none",
          }}
        >
          X: {mouseCoord.x} &nbsp; Y: {mouseCoord.y}
        </div>
      )}

      {/* Map legend overlay */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 12px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "var(--text-secondary)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ color: "var(--accent-cyan)", fontWeight: 700, marginBottom: 6, fontSize: 11 }}>
          {env.id} · {env.name}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "3px 10px" }}>
          <span style={{ color: "var(--accent-cyan)" }}>● Agent</span>
          <span style={{ color: "var(--accent-amber)" }}>✛ Target</span>
          <span style={{ color: "var(--accent-green)" }}>⚡ Charging</span>
          <span style={{ color: "var(--color-rack)" }}>▬ Rack</span>
          <span style={{ color: "var(--accent-purple)" }}>┄ Alt Route</span>
          <span style={{ color: "#a83b3b" }}>▨ Restricted</span>
        </div>
      </div>

      {/* Scale indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: `${5 * scale}px`,
              height: 2,
              background: "var(--accent-cyan)",
              opacity: 0.5,
            }}
          />
          <span>5 units</span>
        </div>
        <div style={{ marginTop: 4 }}>
          Grid: {envWidth} × {envHeight}
        </div>
      </div>
    </div>
  );
}
