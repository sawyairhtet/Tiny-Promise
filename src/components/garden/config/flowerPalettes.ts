export type ArchetypeKey =
  | "lotus"
  | "lily"
  | "rose"
  | "tulip"
  | "cherryBlossom"
  | "bluebell"
  | "iris"
  | "daffodil"
  | "orchid"
  | "dahlia"
  | "wisteria"
  | "lavender";

export interface FlowerPalette {
  petal: string;
  accent: string;
  stamen: string;
}

export const FLOWER_PALETTES: Record<ArchetypeKey, FlowerPalette[]> = {
  lotus: [
    { petal: "#FBD9DE", accent: "#F6BFC9", stamen: "#E8B860" },
    { petal: "#FFF1E6", accent: "#F8D9C2", stamen: "#E2A23C" },
    { petal: "#F8C9D8", accent: "#E29DAE", stamen: "#D69635" },
  ],
  lily: [
    { petal: "#FBF1E2", accent: "#F2C8A3", stamen: "#D86A1A" },
    { petal: "#F6E6D2", accent: "#E8B381", stamen: "#C25A12" },
    { petal: "#FFF4DD", accent: "#F5C091", stamen: "#E8761B" },
  ],
  rose: [
    { petal: "#8E1B2C", accent: "#480913", stamen: "#1E0407" },
    { petal: "#B22535", accent: "#5E0F18", stamen: "#2A0509" },
    { petal: "#6E1426", accent: "#36050D", stamen: "#180207" },
    { petal: "#CC4361", accent: "#7E1B33", stamen: "#39060F" },
  ],
  tulip: [
    { petal: "#F4C84A", accent: "#E0A02C", stamen: "#5C3A12" },
    { petal: "#F37B5B", accent: "#C84A2E", stamen: "#3D1208" },
    { petal: "#F4ECE0", accent: "#D9C7B2", stamen: "#4A3422" },
    { petal: "#B895D8", accent: "#7E58A6", stamen: "#2F1644" },
    { petal: "#321124", accent: "#1A0612", stamen: "#08020A" },
  ],
  cherryBlossom: [
    { petal: "#FBE0E4", accent: "#F5C0CC", stamen: "#C8615E" },
    { petal: "#FCEAEB", accent: "#F8C9D2", stamen: "#B0494B" },
  ],
  bluebell: [
    { petal: "#3F65C6", accent: "#5E3FAF", stamen: "#E4DFFF" },
    { petal: "#4F75D9", accent: "#6B47BC", stamen: "#F0EAFF" },
  ],
  iris: [
    { petal: "#5E2A8B", accent: "#36154C", stamen: "#F2C24A" },
    { petal: "#6F36A3", accent: "#451B5F", stamen: "#F4CB54" },
    { petal: "#4B1E76", accent: "#280D43", stamen: "#E8B238" },
  ],
  daffodil: [
    { petal: "#FAEFD4", accent: "#F0D996", stamen: "#E69612" },
    { petal: "#FFF5DA", accent: "#F6DD9C", stamen: "#EA9F1F" },
  ],
  orchid: [
    { petal: "#FBE9F0", accent: "#C3489B", stamen: "#5B1B6C" },
    { petal: "#F5DCEB", accent: "#A93487", stamen: "#4A1357" },
  ],
  dahlia: [
    { petal: "#B85120", accent: "#E89A3A", stamen: "#3F1604" },
    { petal: "#C66027", accent: "#F2AB48", stamen: "#4A1B07" },
    { petal: "#A14318", accent: "#E08C2E", stamen: "#341104" },
  ],
  wisteria: [
    { petal: "#C5A6E2", accent: "#6E3FAA", stamen: "#F2EFFB" },
    { petal: "#D4B8EC", accent: "#7B4BB8", stamen: "#FAF6FF" },
  ],
  lavender: [
    { petal: "#B596D9", accent: "#5C3D8E", stamen: "#3B225B" },
    { petal: "#C0A4DE", accent: "#67459A", stamen: "#412766" },
  ],
};

export function getPalette(
  archetype: ArchetypeKey,
  variant: number,
): FlowerPalette {
  const list = FLOWER_PALETTES[archetype];
  return list[variant % list.length];
}

export function getPaletteCount(archetype: ArchetypeKey): number {
  return FLOWER_PALETTES[archetype].length;
}
