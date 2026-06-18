/**
 * StayEase MUI Theme
 * ─────────────────────────────────────────────────────────────────────────────
 * Built on design tokens from ./tokens.js.
 * Targets MUI v9 — uses createTheme from @mui/material/styles.
 *
 * Architecture:
 *   tokens.js   → raw values (colors, sizes, radii…)
 *   colors.js   → semantic aliases (backward-compat layer for components)
 *   theme.js    → MUI theme (this file) — consumed via ThemeProvider
 */
import { createTheme } from "@mui/material/styles";
import { color, font, shadow, radius, transition } from "./tokens";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const palette = {
  primary: {
    main:         color.coral,
    light:        color.coralLight,
    dark:         color.coralDark,
    contrastText: color.white,
  },
  secondary: {
    main:         color.teal,
    light:        color.tealLight,
    dark:         color.tealDark,
    contrastText: color.white,
  },
  error:   { main: color.error,   contrastText: color.white },
  warning: { main: color.warning, contrastText: color.white },
  success: { main: color.success, contrastText: color.white },
  info:    { main: color.info,    contrastText: color.white },
  background: {
    default: color.grey50,
    paper:   color.grey50,
  },
  text: {
    primary:   color.ink800,
    secondary: color.ink400,
    disabled:  color.ink200,
  },
  divider: color.grey200,

  // Custom palette extensions (accessible via theme.palette.neutral etc.)
  neutral: {
    50:  color.grey50,
    100: color.grey100,
    200: color.grey200,
    300: color.grey300,
    400: color.grey400,
    600: color.ink400,
    800: color.ink800,
    900: color.ink900,
  },
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
const typography = {
  fontFamily: font.family,
  htmlFontSize: 16,

  // Display / Hero — used on landing page h1
  h1: {
    fontSize:      "2.5rem",     // 40px desktop
    fontWeight:    font.weight.extrabold,
    lineHeight:    font.leading.tight,
    letterSpacing: font.tracking.tight,
    "@media (max-width:600px)": {
      fontSize: "1.875rem",      // 30px mobile
    },
  },

  // Page title — AdminHotels, Manager Dashboard headers
  h2: {
    fontSize:      "2rem",       // 32px
    fontWeight:    font.weight.bold,
    lineHeight:    font.leading.snug,
    letterSpacing: font.tracking.snug,
    "@media (max-width:600px)": {
      fontSize: "1.5rem",
    },
  },

  // Section title — hotel name on detail page
  h3: {
    fontSize:      "1.5rem",     // 24px
    fontWeight:    font.weight.bold,
    lineHeight:    1.3,
    letterSpacing: font.tracking.snug,
  },

  // Card title, dialog title
  h4: {
    fontSize:  "1.25rem",        // 20px
    fontWeight: font.weight.bold,
    lineHeight: 1.35,
  },

  // Section sub-heading
  h5: {
    fontSize:  "1.125rem",       // 18px
    fontWeight: font.weight.semibold,
    lineHeight: 1.4,
  },

  // Compact heading — table section labels
  h6: {
    fontSize:  "1rem",           // 16px
    fontWeight: font.weight.semibold,
    lineHeight: font.leading.normal,
  },

  // Default prose — descriptions, form labels
  body1: {
    fontSize:   "1rem",          // 16px
    fontWeight: font.weight.regular,
    lineHeight: font.leading.relaxed,
  },

  // Secondary prose — hotel card description, table cells
  body2: {
    fontSize:   "0.875rem",      // 14px
    fontWeight: font.weight.regular,
    lineHeight: 1.57,
  },

  // Metadata — dates, helper text, "sorted by"
  caption: {
    fontSize:      "0.75rem",    // 12px
    fontWeight:    font.weight.regular,
    lineHeight:    font.leading.normal,
    letterSpacing: font.tracking.wide,
  },

  // Button text
  button: {
    fontSize:      "0.875rem",   // 14px
    fontWeight:    font.weight.semibold,
    textTransform: "none",       // No ALL CAPS — Airbnb style
    letterSpacing: "0.01em",
  },

  // Category labels — "AMENITIES", table column headers
  overline: {
    fontSize:      "0.75rem",    // 12px
    fontWeight:    font.weight.semibold,
    textTransform: "uppercase",
    letterSpacing: font.tracking.widest,
    lineHeight:    font.leading.normal,
  },
};

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
// MUI expects exactly 25 shadow levels (0–24)
const shadows = [
  shadow.none,                   // 0  — no elevation
  shadow.sm,                     // 1  — navbar scrolled, chips
  shadow.sm,                     // 2
  shadow.md,                     // 3  — dropdowns, cards hover
  shadow.md,                     // 4
  shadow.md,                     // 5
  shadow.lg,                     // 6  — sticky bars
  shadow.lg,                     // 7
  shadow.lg,                     // 8
  shadow.xl,                     // 9  — modals, dialogs
  shadow.xl,                     // 10
  shadow.xl,                     // 11
  shadow.xl,                     // 12
  shadow.xl,                     // 13
  shadow.xl,                     // 14
  shadow.xl,                     // 15
  shadow.xl,                     // 16
  shadow.xl,                     // 17
  shadow.xl,                     // 18
  shadow.xl,                     // 19
  shadow.xl,                     // 20
  shadow.xl,                     // 21
  shadow.xl,                     // 22
  shadow.xl,                     // 23
  shadow.xl,                     // 24
];

// ─── COMPONENT OVERRIDES ─────────────────────────────────────────────────────
const components = {

  // ── AppBar ─────────────────────────────────────────────────────────────────
  // White, borderless at top; border appears on scroll (handled in Navbar.jsx)
  MuiAppBar: {
    defaultProps: { elevation: 0, color: "inherit" },
    styleOverrides: {
      root: {
        backgroundColor: color.white,
        color:           color.ink800,
        backgroundImage: "none",
        boxShadow:       shadow.none,
      },
    },
  },

  // ── Button ─────────────────────────────────────────────────────────────────
  // Airbnb style: flat, no gradients, tight border-radius, no uppercase
  MuiButton: {
    defaultProps: { disableElevation: true, disableRipple: false },
    styleOverrides: {
      root: {
        borderRadius:  radius.sm,
        fontWeight:    font.weight.semibold,
        textTransform: "none",
        boxShadow:     shadow.none,
        transition:    `background-color ${transition.base}, box-shadow ${transition.base}`,
        "&:hover":  { boxShadow: shadow.none },
        "&:active": { transform: "none" },
        "&:focus-visible": {
          outline:       `2px solid ${color.coral}`,
          outlineOffset: "2px",
        },
      },
      // Sizes
      sizeLarge:  { padding: "12px 28px", fontSize: "1rem",      minHeight: 52 },
      sizeMedium: { padding: "10px 20px", fontSize: "0.875rem",  minHeight: 44 },
      sizeSmall:  { padding: "6px 14px",  fontSize: "0.8125rem", minHeight: 36 },

      // Variants
      containedPrimary: {
        backgroundColor: color.coral,
        color:           color.white,
        "&:hover":       { backgroundColor: color.coralDark },
        "&.Mui-disabled":{ backgroundColor: color.grey200, color: color.ink200 },
      },
      containedSecondary: {
        backgroundColor: color.teal,
        color:           color.white,
        "&:hover":       { backgroundColor: color.tealDark },
      },
      outlinedPrimary: {
        borderColor: color.grey300,
        color:       color.ink800,
        "&:hover": {
          backgroundColor: color.grey100,
          borderColor:     color.ink800,
        },
      },
      textPrimary: {
        color:   color.coral,
        "&:hover": { backgroundColor: color.coralSubtle },
      },
    },
  },

  // ── Card ───────────────────────────────────────────────────────────────────
  // Airbnb listing cards: borderless, no shadow at rest, lift on hover
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius:    radius.lg,
        boxShadow:       shadow.none,
        border:          "none",
        backgroundColor: color.grey50,
        backgroundImage: "none",
        transition:      `transform ${transition.base}`,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "12px 4px",
        "&:last-child": { paddingBottom: 12 },
      },
    },
  },

  // ── Paper ──────────────────────────────────────────────────────────────────
  MuiPaper: {
    styleOverrides: {
      root:       { backgroundImage: "none" },
      elevation0: { boxShadow: shadow.none },
      elevation1: { boxShadow: shadow.sm },
      elevation2: { boxShadow: shadow.md },
      elevation3: { boxShadow: shadow.lg },
      elevation4: { boxShadow: shadow.xl },
    },
  },

  // ── TextField / Input ──────────────────────────────────────────────────────
  MuiTextField: {
    defaultProps: { variant: "outlined", size: "medium" },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius:    radius.md,
        backgroundColor: color.white,
        transition:      `box-shadow ${transition.base}`,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: color.grey200,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: color.ink400,
        },
        "&.Mui-focused": {
          boxShadow: `0 0 0 3px ${color.coralSubtle}`,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: color.coral,
          borderWidth:  2,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: color.error,
        },
        "&.Mui-disabled": {
          backgroundColor: color.grey100,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color:           color.ink400,
        "&.Mui-focused": { color: color.coral },
        "&.Mui-error":   { color: color.error },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: { fontSize: "0.75rem", marginTop: 4 },
    },
  },

  // ── Select ─────────────────────────────────────────────────────────────────
  MuiSelect: {
    styleOverrides: {
      icon: { color: color.ink400 },
    },
  },

  // ── Table ──────────────────────────────────────────────────────────────────
  MuiTableContainer: {
    styleOverrides: {
      root: { borderRadius: radius.md, overflow: "hidden" },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        "& .MuiTableCell-root": {
          backgroundColor: color.grey100,
          color:           color.ink400,
          fontWeight:      font.weight.semibold,
          fontSize:        "0.8125rem",
          textTransform:   "uppercase",
          letterSpacing:   "0.05em",
          borderBottom:    `2px solid ${color.grey200}`,
          padding:         "14px 16px",
          whiteSpace:      "nowrap",
        },
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        "& .MuiTableRow-root": {
          transition: `background-color ${transition.fast}`,
          "&:hover":       { backgroundColor: color.grey100 },
          "&:last-child td": { borderBottom: "none" },
        },
        "& .MuiTableCell-root": {
          padding:     "14px 16px",
          borderBottom:`1px solid ${color.grey200}`,
          fontSize:    "0.9375rem",
          color:       color.ink800,
        },
      },
    },
  },

  // ── Chip ───────────────────────────────────────────────────────────────────
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: radius.xs,
        fontWeight:   font.weight.medium,
        fontSize:     "0.8125rem",
        height:       28,
      },
      // Semantic color variants
      colorPrimary:   {
        backgroundColor: color.coralSubtle,
        color:           color.coral,
        fontWeight:      font.weight.semibold,
      },
      colorSecondary: {
        backgroundColor: color.tealSubtle,
        color:           color.tealDark,
        fontWeight:      font.weight.semibold,
      },
      colorSuccess: {
        backgroundColor: color.successSubtle,
        color:           color.success,
        fontWeight:      font.weight.semibold,
      },
      colorError: {
        backgroundColor: color.errorSubtle,
        color:           color.error,
        fontWeight:      font.weight.semibold,
      },
      colorWarning: {
        backgroundColor: color.warningSubtle,
        color:           color.warning,
        fontWeight:      font.weight.semibold,
      },
    },
  },

  // ── Dialog ─────────────────────────────────────────────────────────────────
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: radius.xl,
        boxShadow:    shadow.xl,
        border:       `1px solid ${color.grey200}`,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize:   "1.125rem",
        fontWeight: font.weight.bold,
        padding:    "24px 24px 12px",
        color:      color.ink800,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: { padding: "8px 24px 16px" },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: { padding: "16px 24px 24px", gap: 8 },
    },
  },

  // ── Alert ──────────────────────────────────────────────────────────────────
  MuiAlert: {
    styleOverrides: {
      root:            { borderRadius: radius.md, fontSize: "0.9375rem" },
      standardInfo:    { backgroundColor: color.infoSubtle },
      standardSuccess: { backgroundColor: color.successSubtle },
      standardError:   { backgroundColor: color.errorSubtle },
      standardWarning: { backgroundColor: color.warningSubtle },
    },
  },

  // ── Divider ────────────────────────────────────────────────────────────────
  MuiDivider: {
    styleOverrides: {
      root: { borderColor: color.grey200 },
    },
  },

  // ── Tooltip ────────────────────────────────────────────────────────────────
  MuiTooltip: {
    defaultProps: { arrow: true },
    styleOverrides: {
      tooltip: {
        borderRadius:    radius.xs,
        fontSize:        "0.8125rem",
        backgroundColor: color.ink800,
        padding:         "6px 12px",
        fontWeight:      font.weight.medium,
      },
      arrow: { color: color.ink800 },
    },
  },

  // ── Switch ─────────────────────────────────────────────────────────────────
  MuiSwitch: {
    styleOverrides: {
      root:  { padding: 7 },
      thumb: { borderRadius: 6 },
      track: { borderRadius: 8, opacity: 0.3 },
      switchBase: {
        "&.Mui-checked + .MuiSwitch-track": { opacity: 0.6 },
      },
    },
  },

  // ── Autocomplete ───────────────────────────────────────────────────────────
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        borderRadius: radius.md,
        boxShadow:    shadow.lg,
        border:       `1px solid ${color.grey200}`,
        marginTop:    4,
      },
      option: {
        fontSize:   "0.9375rem",
        padding:    "10px 16px",
        "&[aria-selected='true']": {
          backgroundColor: color.coralSubtle,
          color:           color.coral,
        },
        "&.Mui-focused": {
          backgroundColor: color.grey100,
        },
        "&[aria-selected='true'].Mui-focused": {
          backgroundColor: color.coralSubtle,
        },
      },
      noOptions: {
        fontSize: "0.9375rem",
        color:    color.ink400,
        padding:  "12px 16px",
      },
    },
  },

  // ── Menu / MenuItem ────────────────────────────────────────────────────────
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: radius.md,
        boxShadow:    shadow.lg,
        border:       `1px solid ${color.grey200}`,
        marginTop:    4,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize:  "0.9375rem",
        padding:   "10px 16px",
        "&:hover": { backgroundColor: color.grey100 },
        "&.Mui-selected": {
          backgroundColor: color.coralSubtle,
          color:           color.coral,
          "&:hover":       { backgroundColor: color.coralSubtle },
        },
        "&:focus-visible": {
          backgroundColor: color.grey100,
        },
      },
    },
  },

  // ── IconButton ─────────────────────────────────────────────────────────────
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: radius.sm,
        transition:   `background-color ${transition.base}, color ${transition.base}`,
        "&:focus-visible": {
          outline:       `2px solid ${color.coral}`,
          outlineOffset: "2px",
        },
      },
    },
  },

  // ── Linear Progress ────────────────────────────────────────────────────────
  MuiLinearProgress: {
    styleOverrides: {
      root:         { borderRadius: radius.full, height: 6 },
      bar:          { borderRadius: radius.full },
      colorPrimary: { backgroundColor: color.grey200 },
      barColorPrimary: { backgroundColor: color.coral },
    },
  },

  // ── Skeleton ───────────────────────────────────────────────────────────────
  MuiSkeleton: {
    defaultProps: { animation: "wave" },
    styleOverrides: {
      root: { borderRadius: radius.sm, backgroundColor: color.grey200 },
    },
  },
};

// ─── THEME ASSEMBLY ──────────────────────────────────────────────────────────
const theme = createTheme({
  palette,
  typography,
  shadows,
  shape: { borderRadius: radius.md },
  spacing: 8,                      // base unit = 8px
  components,
});

export default theme;
