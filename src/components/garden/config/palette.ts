export const SKY = {
  zenith: "#0B1340",
  mid: "#3C2562",
  horizon: "#7E4A6C",
  canvasClear: "#0B1340",
  star: "#F4E5D6",
  moonCore: "#F4E5D6",
  moonHalo: "#F4E5D6",
} as const;

export const GROUND = {
  planter: "#1A0F0A",
  fogCenter: "#2C1F3D",
  fogEdge: "rgba(44, 31, 61, 0)",
} as const;

export const LIGHTS = {
  hemiSky: "#9C8CC7",
  hemiGround: "#3A2540",
  moon: "#D6E0FF",
  warmRim: "#FFB37A",
  ambient: "#3A2540",
} as const;

export const ATMOSPHERE = {
  clayTerracotta: "#A87060",
  sproutStem: "#527A52",
  sproutLeaf: "#6B966B",
  labelText: "#E8D5C2",
} as const;

export const CSS_SKY_GRADIENT = `linear-gradient(180deg, ${SKY.zenith} 0%, ${SKY.mid} 55%, ${SKY.horizon} 100%)`;
