export type LayoutId = "classic-4" | "classic-3" | "classic-5" | "grid-2x2" | "wide-film" | "collage";

export type FrameThemeId =
  | "standard"
  | "cafe"
  | "film"
  | "polkadot"
  | "grid"
  | "floral"
  | "love-on-film"
  | "love-letters"
  | "lovely-little-day"
  | "bloom-together"
  | "sweet-little-chaos"
  | "admit-one-more"
  | "cherry-kisses"
  | "frame-film"
  | "summer-memories"
  | "music-player"
  | "pink-bow"
  | "share-this-strip";

export type FilterId =
  | "provia"
  | "classic-chrome"
  | "nostalgic-neg"
  | "classic-negative"
  | "velvia"
  | "astia"
  | "acros"
  | "s-cinetone"
  | "sony-fl"
  | "sony-in"
  | "kodak-portra"
  | "faded-polaroid"
  | "cyberpunk-night";

export type CapturedPhoto = {
  id: string;
  src: string;
  filter: FilterId;
};

export type LayoutOption = {
  id: LayoutId;
  name: string;
  shortName: string;
  description: string;
  photoCount: number;
  gridClass: string;
};

export type FrameSlot = {
  x: number;
  y: number;
  width: number;
  height: number;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  shape?: "rect" | "ellipse";
};

export type FrameOption = {
  id: FrameThemeId;
  name: string;
  detail: string;
  layoutId?: LayoutId;
  overlaySrc?: string;
  width?: number;
  height?: number;
  slots?: FrameSlot[];
};

export const LAYOUTS: LayoutOption[] = [
  { id: "classic-4", name: "Classic Vertical", shortName: "1 × 4", description: "The timeless photo strip", photoCount: 4, gridClass: "layout-classic-4" },
  { id: "classic-3", name: "Classic Vertical", shortName: "1 × 3", description: "Three little moments", photoCount: 3, gridClass: "layout-classic-3" },
  { id: "classic-5", name: "Cinema Strip", shortName: "1 × 5", description: "Five frames on a reel", photoCount: 5, gridClass: "layout-classic-5" },
  { id: "grid-2x2", name: "Grid Polaroid", shortName: "2 × 2", description: "Four frames, one favorite", photoCount: 4, gridClass: "layout-grid-2x2" },
  { id: "wide-film", name: "Wide Film", shortName: "4 × 1", description: "A little panoramic story", photoCount: 4, gridClass: "layout-wide-film" },
  { id: "collage", name: "Cute Collage", shortName: "1 + 2", description: "One big, two little", photoCount: 3, gridClass: "layout-collage" },
];

export const FRAMES: FrameOption[] = [
  // Custom illustrated & themed photostrip assets
  {
    id: "love-on-film",
    name: "Love on Film",
    detail: "The Little Picture House",
    layoutId: "classic-4",
    overlaySrc: "/frames/love-on-film.png",
    width: 1200,
    height: 3600,
    slots: [
      { x: 111, y: 508, width: 978, height: 581, xPct: 9.25, yPct: 14.111, wPct: 81.5, hPct: 16.139 },
      { x: 111, y: 1157, width: 978, height: 581, xPct: 9.25, yPct: 32.139, wPct: 81.5, hPct: 16.139 },
      { x: 111, y: 1806, width: 978, height: 581, xPct: 9.25, yPct: 50.167, wPct: 81.5, hPct: 16.139 },
      { x: 111, y: 2454, width: 978, height: 581, xPct: 9.25, yPct: 68.167, wPct: 81.5, hPct: 16.139 },
    ],
  },
  {
    id: "lovely-little-day",
    name: "A Lovely Little Day",
    detail: "Lavender & daisies",
    layoutId: "classic-4",
    overlaySrc: "/frames/lovely-little-day.png",
    width: 1200,
    height: 3600,
    slots: [
      { x: 107, y: 504, width: 986, height: 582, xPct: 8.917, yPct: 14.0, wPct: 82.167, hPct: 16.167 },
      { x: 107, y: 1153, width: 986, height: 581, xPct: 8.917, yPct: 32.028, wPct: 82.167, hPct: 16.139 },
      { x: 107, y: 1802, width: 986, height: 581, xPct: 8.917, yPct: 50.056, wPct: 82.167, hPct: 16.139 },
      { x: 107, y: 2451, width: 986, height: 581, xPct: 8.917, yPct: 68.083, wPct: 82.167, hPct: 16.139 },
    ],
  },
  {
    id: "sweet-little-chaos",
    name: "Sweet Little Chaos",
    detail: "The Ribbon Club",
    layoutId: "classic-4",
    overlaySrc: "/frames/sweet-little-chaos.png",
    width: 1200,
    height: 3600,
    slots: [
      { x: 110, y: 500, width: 979, height: 575, xPct: 9.167, yPct: 13.889, wPct: 81.583, hPct: 15.972 },
      { x: 110, y: 1149, width: 979, height: 574, xPct: 9.167, yPct: 31.917, wPct: 81.583, hPct: 15.944 },
      { x: 110, y: 1798, width: 979, height: 574, xPct: 9.167, yPct: 49.944, wPct: 81.583, hPct: 15.944 },
      { x: 110, y: 2447, width: 979, height: 574, xPct: 9.167, yPct: 67.972, wPct: 81.583, hPct: 15.944 },
    ],
  },
  {
    id: "admit-one-more",
    name: "Admit One More",
    detail: "Vintage movie ticket",
    layoutId: "classic-4",
    overlaySrc: "/frames/admit-one-more.png",
    width: 1200,
    height: 3757,
    slots: [
      { x: 79, y: 527, width: 1038, height: 718, xPct: 6.583, yPct: 14.027, wPct: 86.5, hPct: 19.111 },
      { x: 79, y: 1275, width: 1038, height: 719, xPct: 6.583, yPct: 33.937, wPct: 86.5, hPct: 19.138 },
      { x: 79, y: 2035, width: 1038, height: 718, xPct: 6.583, yPct: 54.166, wPct: 86.5, hPct: 19.111 },
      { x: 79, y: 2787, width: 1038, height: 718, xPct: 6.583, yPct: 74.182, wPct: 86.5, hPct: 19.111 },
    ],
  },
  {
    id: "share-this-strip",
    name: "A Little Note",
    detail: "From us, with love",
    layoutId: "classic-4",
    overlaySrc: "/frames/share-this-strip.png",
    width: 1200,
    height: 3600,
    slots: [
      { x: 107, y: 456, width: 986, height: 570, xPct: 8.917, yPct: 12.667, wPct: 82.167, hPct: 15.833 },
      { x: 107, y: 1100, width: 986, height: 571, xPct: 8.917, yPct: 30.556, wPct: 82.167, hPct: 15.861 },
      { x: 107, y: 1745, width: 986, height: 571, xPct: 8.917, yPct: 48.472, wPct: 82.167, hPct: 15.861 },
      { x: 107, y: 2390, width: 986, height: 571, xPct: 8.917, yPct: 66.389, wPct: 82.167, hPct: 15.861 },
    ],
  },
  {
    id: "love-letters",
    name: "Little Love Letters",
    detail: "Airmail & postage stamps",
    layoutId: "classic-3",
    overlaySrc: "/frames/love-letters.png",
    width: 1200,
    height: 3600,
    slots: [
      { x: 122, y: 418, width: 956, height: 731, xPct: 10.167, yPct: 11.611, wPct: 79.667, hPct: 20.306 },
      { x: 122, y: 1266, width: 956, height: 730, xPct: 10.167, yPct: 35.167, wPct: 79.667, hPct: 20.278 },
      { x: 122, y: 2113, width: 956, height: 731, xPct: 10.167, yPct: 58.694, wPct: 79.667, hPct: 20.306 },
    ],
  },
  {
    id: "bloom-together",
    name: "Bloom Together",
    detail: "Green gingham & daisies",
    layoutId: "classic-3",
    overlaySrc: "/frames/bloom-together.png",
    width: 1200,
    height: 3600,
    slots: [
      { x: 107, y: 433, width: 986, height: 743, xPct: 8.917, yPct: 12.028, wPct: 82.167, hPct: 20.639 },
      { x: 107, y: 1284, width: 986, height: 743, xPct: 8.917, yPct: 35.667, wPct: 82.167, hPct: 20.639 },
      { x: 107, y: 2136, width: 986, height: 742, xPct: 8.917, yPct: 59.333, wPct: 82.167, hPct: 20.611 },
    ],
  },
  {
    id: "cherry-kisses",
    name: "Cherry Kisses",
    detail: "Scalloped ovals & red dots",
    layoutId: "classic-3",
    overlaySrc: "/frames/cherry-kisses.png",
    width: 1200,
    height: 3572,
    slots: [
      { x: 65, y: 348, width: 1084, height: 650, xPct: 5.417, yPct: 9.742, wPct: 90.333, hPct: 18.197, shape: "ellipse" },
      { x: 65, y: 1271, width: 1084, height: 650, xPct: 5.417, yPct: 35.582, wPct: 90.333, hPct: 18.197, shape: "ellipse" },
      { x: 65, y: 2192, width: 1084, height: 650, xPct: 5.417, yPct: 61.366, wPct: 90.333, hPct: 18.197, shape: "ellipse" },
    ],
  },
  {
    id: "summer-memories",
    name: "Summer Memories",
    detail: "Taped pastel polaroids",
    layoutId: "classic-3",
    overlaySrc: "/frames/summer-memories.png",
    width: 1200,
    height: 2667,
    slots: [
      { x: 186, y: 244, width: 828, height: 621, xPct: 15.5, yPct: 9.149, wPct: 69.0, hPct: 23.285 },
      { x: 186, y: 965, width: 828, height: 621, xPct: 15.5, yPct: 36.183, wPct: 69.0, hPct: 23.285 },
      { x: 186, y: 1686, width: 828, height: 621, xPct: 15.5, yPct: 63.217, wPct: 69.0, hPct: 23.285 },
    ],
  },
  {
    id: "music-player",
    name: "Music Player",
    detail: "Back To December",
    layoutId: "classic-3",
    overlaySrc: "/frames/music-player.png",
    width: 1200,
    height: 3161,
    slots: [
      { x: 139, y: 283, width: 922, height: 670, xPct: 11.583, yPct: 8.953, wPct: 76.833, hPct: 21.196 },
      { x: 139, y: 1036, width: 922, height: 692, xPct: 11.583, yPct: 32.774, wPct: 76.833, hPct: 21.892 },
      { x: 139, y: 1790, width: 922, height: 691, xPct: 11.583, yPct: 56.628, wPct: 76.833, hPct: 21.86 },
    ],
  },
  {
    id: "pink-bow",
    name: "Pink Bow",
    detail: "Espresso dots & ribbon",
    layoutId: "classic-3",
    overlaySrc: "/frames/pink-bow.png",
    width: 1200,
    height: 3167,
    slots: [
      { x: 125, y: 129, width: 959, height: 760, xPct: 10.417, yPct: 4.073, wPct: 79.917, hPct: 23.997 },
      { x: 125, y: 1003, width: 959, height: 752, xPct: 10.417, yPct: 31.67, wPct: 79.917, hPct: 23.745 },
      { x: 125, y: 1873, width: 959, height: 749, xPct: 10.417, yPct: 59.141, wPct: 79.917, hPct: 23.65 },
    ],
  },
  {
    id: "frame-film",
    name: "35mm Cinema Reel",
    detail: "Five-frame film negative",
    layoutId: "classic-5",
    overlaySrc: "/frames/frame-film.png",
    width: 1200,
    height: 3333,
    slots: [
      { x: 187, y: 322, width: 819, height: 495, xPct: 15.583, yPct: 9.661, wPct: 68.25, hPct: 14.851 },
      { x: 187, y: 871, width: 819, height: 496, xPct: 15.583, yPct: 26.133, wPct: 68.25, hPct: 14.881 },
      { x: 187, y: 1421, width: 819, height: 495, xPct: 15.583, yPct: 42.634, wPct: 68.25, hPct: 14.851 },
      { x: 187, y: 1970, width: 819, height: 495, xPct: 15.583, yPct: 59.106, wPct: 68.25, hPct: 14.851 },
      { x: 187, y: 2519, width: 819, height: 495, xPct: 15.583, yPct: 75.578, wPct: 68.25, hPct: 14.851 },
    ],
  },
  // Classic procedural frames (compatible with any layout)
  { id: "standard", name: "Standard White", detail: "Clean & classic" },
  { id: "cafe", name: "Cozy Cafe", detail: "A little love note" },
  { id: "film", name: "Retro Film Roll", detail: "Made for the archives" },
  { id: "polkadot", name: "Polkadot Pattern", detail: "Little dots of joy" },
  { id: "grid", name: "Grid / Checkered", detail: "Neat & minimal" },
  { id: "floral", name: "Floral Border", detail: "A leafy little frame" },
];

export const FILTERS: { id: FilterId; name: string; subtitle: string; css: string }[] = [
  { id: "provia", name: "Provia", subtitle: "Standard", css: "none" },
  { id: "classic-chrome", name: "Classic Chrome", subtitle: "Muted & lovely", css: "contrast(1.1) saturate(0.65) sepia(0.15) hue-rotate(-5deg)" },
  { id: "nostalgic-neg", name: "Nostalgic Neg", subtitle: "Golden hour", css: "contrast(1.05) saturate(0.85) sepia(0.25) hue-rotate(5deg) brightness(1.05)" },
  { id: "classic-negative", name: "Classic Negative", subtitle: "Deep, moody color", css: "contrast(1.2) saturate(0.7) sepia(0.1) hue-rotate(-15deg)" },
  { id: "velvia", name: "Velvia", subtitle: "Punchy & vivid", css: "contrast(1.2) saturate(1.4) brightness(1.05)" },
  { id: "astia", name: "Astia", subtitle: "Soft & sweet", css: "contrast(0.9) saturate(1.1) brightness(1.1) sepia(0.05)" },
  { id: "acros", name: "Acros", subtitle: "Black & white", css: "grayscale(100%) contrast(1.25) brightness(0.95)" },
  { id: "s-cinetone", name: "S-Cinetone", subtitle: "Soft cinematic", css: "contrast(0.95) saturate(0.9) brightness(1.05) sepia(0.05)" },
  { id: "sony-fl", name: "Sony FL (Film)", subtitle: "Moody & teal", css: "contrast(1.1) saturate(0.8) sepia(0.15) hue-rotate(-15deg)" },
  { id: "sony-in", name: "Sony IN (Instant)", subtitle: "Washed vintage", css: "contrast(0.85) saturate(0.9) sepia(0.3) brightness(1.1)" },
  { id: "kodak-portra", name: "Kodak Portra", subtitle: "Warm & golden", css: "contrast(1.1) saturate(1.2) sepia(0.1) hue-rotate(5deg)" },
  { id: "faded-polaroid", name: "Faded Polaroid", subtitle: "Softly faded", css: "contrast(0.8) brightness(1.1) sepia(0.2)" },
  { id: "cyberpunk-night", name: "Cyberpunk Night", subtitle: "Electric after-dark", css: "contrast(1.2) saturate(1.5) hue-rotate(180deg)" },
];

export const getLayout = (id: LayoutId) => LAYOUTS.find((layout) => layout.id === id) ?? LAYOUTS[0];
export const getFilter = (id: FilterId) => FILTERS.find((filter) => filter.id === id) ?? FILTERS[0];
export const getFrame = (id: FrameThemeId) => FRAMES.find((frame) => frame.id === id) ?? FRAMES[0];
export const getFramesForLayout = (layoutId: LayoutId) =>
  FRAMES.filter((frame) => !frame.layoutId || frame.layoutId === layoutId);
