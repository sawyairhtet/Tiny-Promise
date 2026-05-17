export const SKY = {
  zenith: "#140F34",
  mid: "#3F2A60",
  horizon: "#B76B7B",
  canvasClear: "#140F34",
  star: "#FFE7B5",
  moonCore: "#FFF1D8",
  moonHalo: "#FFD6A6",
} as const;

export const GROUND = {
  planter: "#32213A",
  fogCenter: "#61436A",
  fogEdge: "rgba(97, 67, 106, 0)",
} as const;

export const LIGHTS = {
  hemiSky: "#C5B5F1",
  hemiGround: "#5C3A54",
  moon: "#EDF0FF",
  warmRim: "#FFC08A",
  ambient: "#8A5C78",
} as const;

export const ATMOSPHERE = {
  clayTerracotta: "#A87060",
  sproutStem: "#527A52",
  sproutLeaf: "#6B966B",
  labelText: "#E8D5C2",
} as const;

export const CSS_SKY_GRADIENT = `linear-gradient(180deg, ${SKY.zenith} 0%, ${SKY.mid} 55%, ${SKY.horizon} 100%)`;
