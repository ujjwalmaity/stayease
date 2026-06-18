/**
 * StayEase Design Tokens
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all raw design values.
 * Inspired by Airbnb's visual language + Hotels.com's information clarity.
 *
 * USAGE
 *   import { color, radius, shadow, space, font } from "./tokens";
 *
 * DO NOT import these directly into JSX sx props — use the MUI theme instead.
 * Direct token usage is only for theme.js and colors.js (legacy alias).
 */

// ─── COLOR ───────────────────────────────────────────────────────────────────

export const color = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  /** Airbnb coral — primary CTA, logo, active states */
  coral:          "#FF5A5F",
  coralLight:     "#FF8589",
  coralDark:      "#D93025",
  coralSubtle:    "#FFF0F0",   // backgrounds, chip fill

  /** Airbnb teal — secondary actions, availability badges */
  teal:           "#00A699",
  tealLight:      "#33BDB6",
  tealDark:       "#007A70",
  tealSubtle:     "#E0F5F4",

  // ── Neutral ────────────────────────────────────────────────────────────────
  /** Airbnb near-black — primary text, nav, headings */
  ink900:         "#111111",
  ink800:         "#222222",
  ink600:         "#484848",
  ink400:         "#717171",
  ink200:         "#B0B0B0",

  /** Airbnb warm grey surfaces */
  grey50:         "#FFFFFF",
  grey100:        "#F7F7F7",
  grey200:        "#EBEBEB",
  grey300:        "#DDDDDD",
  grey400:        "#C8C8C8",

  // ── Semantic ───────────────────────────────────────────────────────────────
  success:        "#2E7D32",
  successSubtle:  "#E8F5E9",
  error:          "#D32F2F",
  errorSubtle:    "#FFEBEE",
  warning:        "#F57C00",
  warningSubtle:  "#FFF3E0",
  info:           "#0277BD",
  infoSubtle:     "#E1F5FE",

  // ── Static ─────────────────────────────────────────────────────────────────
  white:          "#FFFFFF",
  black:          "#000000",
};

// ─── SPACING ─────────────────────────────────────────────────────────────────
/**
 * Base unit = 8px (MUI default).
 * All spacing values are multiples of 8px.
 *
 *   space[1] =  8px   (MUI theme.spacing(1))
 *   space[2] = 16px
 *   space[3] = 24px
 *   space[4] = 32px
 *   space[5] = 40px
 *   space[6] = 48px
 *   space[8] = 64px
 *
 * In sx prop:  sx={{ p: 2 }}  → 16px
 *              sx={{ mt: 3 }} → 24px
 */
export const space = {
  unit:   8,
  0:      0,
  0.5:    4,
  1:      8,
  1.5:    12,
  2:      16,
  2.5:    20,
  3:      24,
  4:      32,
  5:      40,
  6:      48,
  7:      56,
  8:      64,
  10:     80,
  12:     96,
};

// ─── BORDER RADIUS ───────────────────────────────────────────────────────────
/**
 * Consistent rounding scale across all components.
 */
export const radius = {
  none:   0,
  xs:     4,    // inline chips, badges
  sm:     8,    // buttons, small chips, tags
  md:     12,   // cards, inputs, tables
  lg:     16,   // hotel cards, image containers
  xl:     20,   // dialogs, modals
  xxl:    24,   // hero sections, large panels
  full:   9999, // pills, avatars
};

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
/**
 * 4-stop elevation scale. Softer than Material Design defaults —
 * closer to Airbnb's barely-there depth system.
 *
 *   none → cards at rest (border-only)
 *   sm   → nav, input focus rings
 *   md   → dropdowns, popovers
 *   lg   → sticky elements, date pickers
 *   xl   → modals, dialogs, search bar
 */
export const shadow = {
  none: "none",
  sm:   "0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)",
  md:   "0px 4px 8px rgba(0,0,0,0.06), 0px 8px 16px rgba(0,0,0,0.08)",
  lg:   "0px 8px 16px rgba(0,0,0,0.08), 0px 16px 32px rgba(0,0,0,0.10)",
  xl:   "0px 16px 40px rgba(0,0,0,0.12)",
  // Coloured glow — used for CTA buttons
  coral: "0px 4px 16px rgba(255,90,95,0.35)",
  teal:  "0px 4px 16px rgba(0,166,153,0.30)",
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
/**
 * Font stack mirrors Airbnb — Inter is loaded via Google Fonts (or system fallback).
 *
 * Scale follows a Minor Third (1.2×) ratio anchored at 16px body:
 *
 *   caption  12px
 *   body2    14px
 *   body1    16px
 *   h6       16px / 600
 *   h5       18px / 600
 *   h4       20px / 700
 *   h3       24px / 700
 *   h2       32px / 700
 *   h1       40px / 800
 */
export const font = {
  family: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',

  // Size scale (rem)
  size: {
    xs:   "0.75rem",   // 12px — caption, overline
    sm:   "0.8125rem", // 13px — table cells, small chips
    base: "0.875rem",  // 14px — body2, button
    md:   "1rem",      // 16px — body1, h6
    lg:   "1.125rem",  // 18px — h5
    xl:   "1.25rem",   // 20px — h4
    "2xl":"1.5rem",    // 24px — h3
    "3xl":"2rem",      // 32px — h2
    "4xl":"2.5rem",    // 40px — h1 desktop
  },

  // Weight
  weight: {
    regular: 400,
    medium:  500,
    semibold:600,
    bold:    700,
    extrabold:800,
  },

  // Line-height
  leading: {
    tight:   1.1,
    snug:    1.25,
    normal:  1.5,
    relaxed: 1.6,
    loose:   1.75,
  },

  // Letter-spacing
  tracking: {
    tight:   "-0.02em",
    snug:    "-0.01em",
    normal:  "0em",
    wide:    "0.02em",
    wider:   "0.05em",
    widest:  "0.08em",
  },
};

// ─── BREAKPOINTS ─────────────────────────────────────────────────────────────
/**
 * Matches MUI defaults — kept here for documentation.
 *
 *   xs   0px    — mobile portrait
 *   sm   600px  — mobile landscape / small tablet
 *   md   900px  — tablet
 *   lg   1200px — desktop
 *   xl   1536px — wide desktop
 */
export const breakpoint = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// ─── Z-INDEX ──────────────────────────────────────────────────────────────────
export const zIndex = {
  base:    0,
  raised:  1,
  dropdown:100,
  sticky:  200,
  navbar:  1100,  // matches MUI AppBar default
  modal:   1300,
  toast:   1400,
};

// ─── TRANSITIONS ─────────────────────────────────────────────────────────────
export const transition = {
  fast:   "0.1s ease",
  base:   "0.2s ease",
  slow:   "0.35s ease",
  spring: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
};
