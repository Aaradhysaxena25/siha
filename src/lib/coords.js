// Coordinate system helpers
// The warehouse uses X: 0->100, Y: 0->80 with origin at bottom-left.
// SVG uses top-left origin with Y going down, so we flip Y.

export function toSvgX(x, scale) {
  return x * scale;
}

export function toSvgY(y, scale, envHeight) {
  return (envHeight - y) * scale;
}

export function toSvgPoint(point, scale, envHeight) {
  return {
    x: toSvgX(point.x, scale),
    y: toSvgY(point.y, scale, envHeight),
  };
}

export function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function rectOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Color mapping by type
export const zoneColors = {
  STORAGE: "var(--zone-storage)",
  LOADING: "var(--zone-loading)",
  UNLOADING: "var(--zone-unloading)",
  RESTRICTED: "var(--zone-restricted)",
  NAVIGATION: "var(--zone-navigation)",
  CHARGING: "var(--zone-charging)",
};

export const zoneBorderColors = {
  STORAGE: "#3b6fa8",
  LOADING: "#a8843b",
  UNLOADING: "#8aa83b",
  RESTRICTED: "#a83b3b",
  NAVIGATION: "#1a6e6e",
  CHARGING: "#3b8aa8",
};

export const zoneLabelColors = {
  STORAGE: "#6fa8e0",
  LOADING: "#e0b86f",
  UNLOADING: "#b8e06f",
  RESTRICTED: "#e06f6f",
  NAVIGATION: "#6fe0e0",
  CHARGING: "#6fcfe0",
};

export const statusColors = {
  MOVING: "var(--accent-cyan)",
  IDLE: "var(--accent-amber)",
  CHARGING: "var(--accent-green)",
  ERROR: "var(--accent-red)",
  AVAILABLE: "var(--accent-green)",
  OCCUPIED: "var(--accent-red)",
  PENDING: "var(--accent-amber)",
  ACTIVE: "var(--accent-cyan)",
  PLANNED: "var(--accent-blue)",
  ALTERNATIVE: "var(--accent-purple)",
  COMPLETED: "var(--accent-green)",
};

export function getScale(viewportWidth, viewportHeight, envWidth, envHeight) {
  const padding = 24;
  const scaleX = (viewportWidth - padding * 2) / envWidth;
  const scaleY = (viewportHeight - padding * 2) / envHeight;
  return Math.min(scaleX, scaleY);
}

export function getOffset(scale, viewportWidth, viewportHeight, envWidth, envHeight) {
  const padding = 24;
  const mapWidth = envWidth * scale;
  const mapHeight = envHeight * scale;
  return {
    x: (viewportWidth - mapWidth) / 2,
    y: (viewportHeight - mapHeight) / 2,
  };
}
