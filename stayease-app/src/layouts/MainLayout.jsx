import { Box } from "@mui/material";

/**
 * MainLayout
 *
 * Strategy:
 *   - paddingTop offsets the fixed Navbar (64px mobile / 72px desktop)
 *   - height: 100vh makes this box exactly the viewport — never more
 *   - overflowY: auto means scroll appears ONLY when page content
 *     genuinely exceeds the viewport (e.g. after search results load)
 *   - Pages that need side padding add it themselves via sx px props,
 *     OR we use px here and full-bleed pages use negative mx to escape it
 *
 * This is the same pattern used by Airbnb, Vercel, and Linear.
 */
export default function MainLayout({ children }) {
  return (
    <Box
      id="main-content"
      component="main"
      sx={{
        paddingTop: { xs: "64px", md: "72px" },
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Inner wrapper provides horizontal padding for all pages */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 3, md: 4, lg: 3 },
          // HomePage hero needs to escape horizontal padding — it handles its own layout
          "& > .full-bleed": {
            mx: { xs: -2, sm: -3, md: -4 },
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
