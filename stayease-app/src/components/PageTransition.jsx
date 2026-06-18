import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { fadeIn, duration, useReducedMotion } from "../theme/animations";

/**
 * PageTransition
 * Wraps page content with a subtle fade-in keyed to the current route.
 * When the route changes React remounts this component → new key → new animation.
 *
 * Usage: wrap <Routes> content inside MainLayout.
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  return (
    <Box
      key={pathname}
      sx={{
        animation: reduced ? "none" : `${fadeIn} ${duration.page}ms ease both`,
      }}
    >
      {children}
    </Box>
  );
}
