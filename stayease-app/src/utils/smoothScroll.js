/**
 * smoothScroll
 *
 * Custom, duration-controlled smooth scrolling.
 *
 * The native `element.scrollIntoView({ behavior: "smooth" })` works, but the
 * browser controls the speed (usually a quick ~300ms snap) and you can't slow
 * it down. This utility animates with `requestAnimationFrame` + an easing curve
 * so we get a deliberate, "slow and effective" glide to the target — and it
 * works inside a custom scroll container (StayEase scrolls `#main-content`,
 * not the window).
 */

/**
 * easeInOutCubic — gentle acceleration then a soft landing.
 * @param {number} t Progress from 0 → 1
 * @returns {number} Eased progress from 0 → 1
 */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Find the nearest scrollable ancestor of an element. Falls back to `null`
 * (meaning: scroll the window) when no scrollable container is found.
 * @param {HTMLElement} el
 * @returns {HTMLElement|null}
 */
function getScrollParent(el) {
  let node = el?.parentElement;
  while (node) {
    const { overflowY } = window.getComputedStyle(node);
    const scrollable = overflowY === "auto" || overflowY === "scroll";
    if (scrollable && node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Smoothly scroll so `target` rests near the top of its scroll container.
 *
 * @param {HTMLElement} target               Element to bring into view.
 * @param {Object}      [options]
 * @param {number}      [options.duration=1200] Animation length in ms — higher is slower.
 * @param {number}      [options.offset=80]      Gap (px) to leave above the target (clears the navbar).
 */
export function smoothScrollTo(target, { duration = 1200, offset = 80 } = {}) {
  if (!target) return;

  const container = getScrollParent(target);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Resolve start + destination scroll positions for either a container or the window.
  let start;
  let destination;

  if (container) {
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    start = container.scrollTop;
    destination = start + (targetTop - containerTop) - offset;
    const max = container.scrollHeight - container.clientHeight;
    destination = Math.max(0, Math.min(destination, max));
  } else {
    start = window.scrollY || window.pageYOffset || 0;
    destination = start + target.getBoundingClientRect().top - offset;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    destination = Math.max(0, Math.min(destination, max));
  }

  const distance = destination - start;

  const setScroll = (y) => {
    if (container) container.scrollTop = y;
    else window.scrollTo(0, y);
  };

  // Accessibility: skip the animation for users who prefer reduced motion,
  // and short-circuit when there's effectively nothing to scroll.
  if (prefersReducedMotion || Math.abs(distance) < 2) {
    setScroll(destination);
    return;
  }

  let startTime = null;
  const step = (now) => {
    if (startTime === null) startTime = now;
    const progress = Math.min((now - startTime) / duration, 1);
    setScroll(start + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
