/**
 * animations.js — Shared animation primitives
 * ─────────────────────────────────────────────────────────────────────────────
 * CSS-only approach: MUI sx keyframes + CSS transitions.
 * No external library — keeps bundle size minimal and avoids hydration issues.
 *
 * All durations respect prefers-reduced-motion:
 *   use `safeDuration(ms)` instead of raw values in sx props.
 *
 * USAGE
 *   import { fadeUp, fadeIn, scaleIn, duration, useReducedMotion } from "../theme/animations";
 *
 *   // In sx prop:
 *   sx={{ animation: `${fadeUp} ${duration.enter}ms both` }}
 *
 *   // With stagger:
 *   sx={{ animation: `${fadeUp} ${duration.enter}ms ${index * 60}ms both` }}
 *
 *   // Reduced motion safe:
 *   const reduced = useReducedMotion();
 *   sx={{ animation: reduced ? "none" : `${fadeUp} ${duration.enter}ms both` }}
 */

import { keyframes } from "@mui/system";
import { useEffect, useState } from "react";

// ─── Keyframes ───────────────────────────────────────────────────────────────

/** Slide up + fade in — used for cards, page content, form panels */
export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** Pure fade — used for overlays, page transitions */
export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

/** Scale + fade — used for dialogs, modals, badges */
export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
`;

/** Scale up from 0 — used for heart button pop, success icons */
export const popIn = keyframes`
  0%   { transform: scale(0);    opacity: 0; }
  60%  { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
`;

/** Slide down from top — used for navbar alerts, toasts */
export const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** Pulse — used for skeleton shimmer override, loading states */
export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

// ─── Duration tokens (ms) ────────────────────────────────────────────────────
// All under 300ms for snappy feel (Airbnb design principle)
export const duration = {
  instant:  80,   // micro-feedback (button press, checkbox)
  fast:     150,  // icon swap, badge appear
  enter:    220,  // element entrance (cards, form)
  page:     260,  // page-level fade
  dialog:   240,  // modal open/close
  stagger:  55,   // delay increment per list item
};

// ─── Easing ──────────────────────────────────────────────────────────────────
export const ease = {
  out:    "cubic-bezier(0.0, 0.0, 0.2, 1)",   // decelerate — enter animations
  in:     "cubic-bezier(0.4, 0.0, 1, 1)",     // accelerate — exit animations
  inOut:  "cubic-bezier(0.4, 0.0, 0.2, 1)",   // standard
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",// overshoot — popIn, hover scale
};

// ─── useReducedMotion hook ───────────────────────────────────────────────────
/**
 * Returns true when the user has requested reduced motion via OS settings.
 * Use this to disable or shorten animations for accessibility (WCAG 2.3.3).
 *
 * @example
 *   const reduced = useReducedMotion();
 *   const anim = reduced ? "none" : `${fadeUp} 220ms both`;
 */
export function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// ─── Helper — build animation string safely ──────────────────────────────────
/**
 * Returns a CSS animation string, or "none" if user prefers reduced motion.
 *
 * @param {string}  keyframe   - result of keyframes`` tag
 * @param {number}  ms         - duration in ms
 * @param {number}  delayMs    - optional stagger delay
 * @param {string}  fill       - animation-fill-mode (default "both")
 * @param {boolean} reduced    - from useReducedMotion()
 */
export function anim(keyframe, ms, delayMs = 0, fill = "both", reduced = false) {
  if (reduced) return "none";
  const delay = delayMs ? ` ${delayMs}ms` : "";
  return `${keyframe} ${ms}ms${delay} ${ease.out} ${fill}`;
}
