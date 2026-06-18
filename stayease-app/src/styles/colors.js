/**
 * colors.js — Semantic color aliases
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps raw token values to semantic names used by components.
 * All values derive from tokens.js — do not hardcode hex values here.
 *
 * Components import `colors` for one-off sx overrides.
 * For consistent theming, prefer `theme.palette.*` via the MUI theme.
 */
import { color } from "../theme/tokens";

const colors = {
  // ── Primary brand (coral) ─────────────────────────────────────────────────
  primary:            color.coral,
  primaryLight:       color.coralLight,
  primaryDark:        color.coralDark,
  primaryContainer:   color.coralSubtle,
  onPrimary:          color.white,

  accent:             color.coral,       // alias — prefer `primary`
  accentLight:        color.coralLight,
  accentDark:         color.coralDark,
  accentContainer:    color.coralSubtle,

  // ── Secondary (teal) ──────────────────────────────────────────────────────
  secondary:          color.teal,
  secondaryLight:     color.tealLight,
  secondaryDark:      color.tealDark,
  secondaryContainer: color.tealSubtle,
  onSecondary:        color.white,

  // ── Semantic states ───────────────────────────────────────────────────────
  success:            color.success,
  successLight:       color.successSubtle,
  error:              color.error,
  errorLight:         color.errorSubtle,
  warning:            color.warning,
  warningLight:       color.warningSubtle,
  info:               color.info,
  infoLight:          color.infoSubtle,

  // ── Surfaces ──────────────────────────────────────────────────────────────
  background:              color.grey50,
  surface:                 color.grey50,
  surfaceContainerLowest:  color.grey50,
  surfaceContainerLow:     color.grey100,
  surfaceContainer:        color.grey200,
  surfaceContainerHigh:    color.grey300,
  surfaceVariant:          color.grey100,

  // ── Text ──────────────────────────────────────────────────────────────────
  onBackground:      color.ink800,
  onSurface:         color.ink800,
  onSurfaceVariant:  color.ink400,
  onSurfaceMuted:    color.ink200,

  // ── Borders ───────────────────────────────────────────────────────────────
  outline:           color.grey300,
  outlineVariant:    color.grey200,

  // ── Inverse ───────────────────────────────────────────────────────────────
  inverseSurface:    color.ink800,
  inverseOnSurface:  color.white,

  // ── Shadows ───────────────────────────────────────────────────────────────
  shadowSm: "0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)",
  shadowMd: "0px 4px 8px rgba(0,0,0,0.06), 0px 8px 16px rgba(0,0,0,0.08)",
  shadowLg: "0px 8px 16px rgba(0,0,0,0.08), 0px 16px 32px rgba(0,0,0,0.10)",
  shadowXl: "0px 16px 40px rgba(0,0,0,0.12)",
};

export default colors;
