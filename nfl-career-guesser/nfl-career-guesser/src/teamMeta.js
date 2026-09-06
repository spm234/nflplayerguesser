// Fallback colors (used only if you haven't dropped in a logo for that team
// yet — see public/logos/README.md). Not official brand assets, just
// reasonable placeholder colors so the fallback badge looks decent.
export const TEAM_COLORS = {
  ARI: { bg: "#97233F", fg: "#FFFFFF" }, ATL: { bg: "#A71930", fg: "#FFFFFF" },
  BAL: { bg: "#241773", fg: "#FFFFFF" }, BUF: { bg: "#00338D", fg: "#FFFFFF" },
  CAR: { bg: "#0085CA", fg: "#FFFFFF" }, CHI: { bg: "#0B162A", fg: "#FFFFFF" },
  CIN: { bg: "#FB4F14", fg: "#0B162A" }, CLE: { bg: "#472A0A", fg: "#FF6A00" },
  DAL: { bg: "#041E42", fg: "#FFFFFF" }, DEN: { bg: "#FB4F14", fg: "#001E62" },
  DET: { bg: "#0076B6", fg: "#FFFFFF" }, GB: { bg: "#203731", fg: "#FFB612" },
  HOU: { bg: "#03202F", fg: "#A71930" }, IND: { bg: "#002C5F", fg: "#FFFFFF" },
  JAX: { bg: "#006778", fg: "#D7A22A" }, KC: { bg: "#E31837", fg: "#FFFFFF" },
  LA: { bg: "#003594", fg: "#FFD100" }, LAC: { bg: "#0080C6", fg: "#FFC20E" },
  LV: { bg: "#000000", fg: "#A5ACAF" }, MIA: { bg: "#008E97", fg: "#F58220" },
  MIN: { bg: "#4F2683", fg: "#FFC62F" }, NE: { bg: "#002244", fg: "#C60C30" },
  NO: { bg: "#101820", fg: "#D3BC8D" }, NYG: { bg: "#0B2265", fg: "#A71930" },
  NYJ: { bg: "#125740", fg: "#FFFFFF" }, PHI: { bg: "#004C54", fg: "#A5ACAF" },
  PIT: { bg: "#000000", fg: "#FFB612" }, SEA: { bg: "#002244", fg: "#69BE28" },
  SF: { bg: "#AA0000", fg: "#B3995D" }, TB: { bg: "#D50A0A", fg: "#0A0A08" },
  TEN: { bg: "#0C2340", fg: "#4B92DB" }, WAS: { bg: "#5A1414", fg: "#FFB612" },
};

// All 32 team codes used by the dataset — the exact filenames the app
// looks for in public/logos/ (e.g. public/logos/ARI.png).
export const ALL_TEAM_CODES = Object.keys(TEAM_COLORS);
