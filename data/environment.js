export const boundaries = [
  { id: "B01", type: "wall", x: 0, y: 0, width: 100, height: 2, label: "South wall" },
  { id: "B02", type: "wall", x: 0, y: 78, width: 100, height: 2, label: "North wall" },
  { id: "B03", type: "wall", x: 0, y: 0, width: 2, height: 80, label: "West wall" },
  { id: "B04", type: "wall", x: 98, y: 0, width: 2, height: 80, label: "East wall" },
  { id: "W01", type: "internal_wall", x: 47, y: 0, width: 3, height: 16, label: "Lower divider" },
  { id: "W02", type: "internal_wall", x: 47, y: 64, width: 3, height: 16, label: "Upper divider" },
  { id: "W03", type: "internal_wall", x: 68, y: 0, width: 3, height: 10, label: "Dispatch divider" },
  { id: "W04", type: "internal_wall", x: 68, y: 70, width: 3, height: 10, label: "Upper dispatch divider" }
];

export const zones = [
  { id: "Z01", name: "Receiving", type: "LOADING", x: 4, y: 4, width: 18, height: 13, label: "Loading zone" },
  { id: "Z02", name: "Storage A", type: "STORAGE", x: 8, y: 18, width: 26, height: 34, label: "Storage zone A" },
  { id: "Z03", name: "Storage B", type: "STORAGE", x: 36, y: 18, width: 16, height: 34, label: "Storage zone B" },
  { id: "Z04", name: "Restricted Core", type: "RESTRICTED", x: 54, y: 20, width: 13, height: 12, label: "Restricted zone" },
  { id: "Z05", name: "Dispatch", type: "UNLOADING", x: 76, y: 4, width: 20, height: 17, label: "Unloading zone" },
  { id: "Z06", name: "Open Navigation Floor", type: "NAVIGATION", x: 34, y: 34, width: 42, height: 30, label: "Primary navigation area" },
  { id: "Z07", name: "Charging Bay West", type: "CHARGING", x: 4, y: 64, width: 18, height: 11, label: "Charging zone west" },
  { id: "Z08", name: "Charging Bay East", type: "CHARGING", x: 78, y: 64, width: 18, height: 11, label: "Charging zone east" }
];

export const obstacles = [
  { id: "R01", type: "storage_rack", x: 11, y: 22, width: 12, height: 5, label: "Rack A1" },
  { id: "R02", type: "storage_rack", x: 11, y: 31, width: 12, height: 5, label: "Rack A2" },
  { id: "R03", type: "storage_rack", x: 11, y: 40, width: 12, height: 5, label: "Rack A3" },
  { id: "R04", type: "storage_rack", x: 27, y: 22, width: 5, height: 12, label: "Rack A4" },
  { id: "R05", type: "storage_rack", x: 27, y: 39, width: 5, height: 10, label: "Rack A5" },
  { id: "R06", type: "storage_rack", x: 38, y: 22, width: 11, height: 5, label: "Rack B1" },
  { id: "R07", type: "storage_rack", x: 38, y: 31, width: 11, height: 5, label: "Rack B2" },
  { id: "R08", type: "storage_rack", x: 38, y: 40, width: 11, height: 5, label: "Rack B3" },
  { id: "R09", type: "storage_rack", x: 53, y: 39, width: 5, height: 13, label: "Rack B4" },
  { id: "R10", type: "storage_rack", x: 75, y: 24, width: 13, height: 5, label: "Rack C1" },
  { id: "R11", type: "storage_rack", x: 75, y: 33, width: 13, height: 5, label: "Rack C2" },
  { id: "R12", type: "storage_rack", x: 75, y: 42, width: 13, height: 5, label: "Rack C3" },
  { id: "O01", type: "obstacle", x: 59, y: 35, width: 6, height: 6, label: "Pallet stack" },
  { id: "O02", type: "obstacle", x: 63, y: 51, width: 6, height: 5, label: "Temporary crate" },
  { id: "O03", type: "obstacle", x: 70, y: 59, width: 5, height: 5, label: "Safety barrier" },
  { id: "O04", type: "obstacle", x: 24, y: 58, width: 6, height: 5, label: "Staged pallet" }
];

export const chargingStations = [
  { id: "C01", type: "CHARGING_STATION", x: 8, y: 67, width: 5, height: 5, status: "AVAILABLE", label: "West charger 1" },
  { id: "C02", type: "CHARGING_STATION", x: 16, y: 67, width: 5, height: 5, status: "AVAILABLE", label: "West charger 2" },
  { id: "C03", type: "CHARGING_STATION", x: 82, y: 67, width: 5, height: 5, status: "AVAILABLE", label: "East charger 1" },
  { id: "C04", type: "CHARGING_STATION", x: 90, y: 67, width: 5, height: 5, status: "OCCUPIED", label: "East charger 2" }
];

export const targets = [
  { id: "T01", x: 84, y: 59, width: 2, height: 2, type: "DELIVERY", status: "PENDING", label: "Delivery point 1" },
  { id: "T02", x: 14, y: 56, width: 2, height: 2, type: "PICKUP", status: "PENDING", label: "Pickup point 2" },
  { id: "T03", x: 91, y: 22, width: 2, height: 2, type: "DELIVERY", status: "PENDING", label: "Delivery point 3" },
  { id: "T04", x: 53, y: 8, width: 2, height: 2, type: "PICKUP", status: "PENDING", label: "Pickup point 4" }
];

export const agents = [
  { id: "A01", x: 15, y: 20, width: 2, height: 2, status: "MOVING", battery: 82, velocity: 2.4, targetId: "T01" },
  { id: "A02", x: 34, y: 58, width: 2, height: 2, status: "MOVING", battery: 67, velocity: 1.8, targetId: "T02" },
  { id: "A03", x: 72, y: 16, width: 2, height: 2, status: "IDLE", battery: 91, velocity: 0, targetId: "T03" },
  { id: "A04", x: 86, y: 55, width: 2, height: 2, status: "CHARGING", battery: 48, velocity: 0, targetId: "T04" }
];

export const routes = [
  {
    id: "RT01",
    agentId: "A01",
    targetId: "T01",
    status: "ACTIVE",
    waypoints: [
      { x: 15, y: 20 },
      { x: 34, y: 20 },
      { x: 34, y: 34 },
      { x: 52, y: 34 },
      { x: 70, y: 34 },
      { x: 70, y: 58 },
      { x: 84, y: 58 },
      { x: 84, y: 59 }
    ]
  },
  {
    id: "RT02",
    agentId: "A02",
    targetId: "T02",
    status: "ACTIVE",
    waypoints: [
      { x: 34, y: 58 },
      { x: 24, y: 58 },
      { x: 14, y: 56 }
    ]
  },
  {
    id: "RT03",
    agentId: "A03",
    targetId: "T03",
    status: "PLANNED",
    waypoints: [
      { x: 72, y: 16 },
      { x: 72, y: 22 },
      { x: 91, y: 22 }
    ]
  },
  {
    id: "RT04",
    agentId: "A04",
    targetId: "T04",
    status: "PLANNED",
    waypoints: [
      { x: 86, y: 55 },
      { x: 70, y: 55 },
      { x: 70, y: 12 },
      { x: 53, y: 8 }
    ]
  },
  {
    id: "RT01-ALT",
    agentId: "A01",
    targetId: "T01",
    status: "ALTERNATIVE",
    waypoints: [
      { x: 15, y: 20 },
      { x: 8, y: 20 },
      { x: 8, y: 60 },
      { x: 52, y: 60 },
      { x: 74, y: 60 },
      { x: 84, y: 59 }
    ]
  }
];

export const warehouseEnvironment = {
  id: "WH-01",
  name: "EdgeFleet Smart Warehouse Demo",
  coordinateSystem: {
    type: "linear_xy",
    width: 100,
    height: 80,
    origin: "south_west",
    units: "warehouse_units"
  },
  boundaries,
  zones,
  obstacles,
  chargingStations,
  targets,
  agents,
  routes
};

export default warehouseEnvironment;
