import { AppBar, Toolbar, Button, Typography, Box, Tooltip, Chip, IconButton, useScrollTrigger } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import CONSTANTS from "../utils/constants";
import colors from "../styles/colors";

// Defined outside component — no recreation on every render
const navLinkSx = (isActive) => ({
  color: isActive ? colors.accent : colors.onSurfaceVariant,
  fontWeight: isActive ? 700 : 500,
  fontSize: "0.875rem",
  px: 1.5,
  py: 0.75,
  borderRadius: 2,
  position: "relative",
  transition: "color 0.2s ease",
  "&:hover": {
    color: colors.onBackground,
    backgroundColor: colors.surfaceContainerLow,
  },
  "&::after": isActive ? {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 1,
  } : {},
});

const roleLabel = { GUEST: null, MANAGER: "Manager", ADMIN: "Admin" };

export default function Navbar() {
  const { role, logout, isAuthenticated, name } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  return (
    <>
      {/* Skip-to-content — WCAG 2.4.1: visible on focus, allows keyboard users to bypass nav */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          zIndex: 9999,
          px: 2, py: 1,
          bgcolor: "background.paper",
          color: "text.primary",
          fontWeight: 600,
          fontSize: "0.9375rem",
          borderRadius: 1,
          boxShadow: 3,
          "&:focus": { left: 8, top: 8 },
        }}
      >
        Skip to main content
      </Box>
      <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderBottom: `1px solid ${scrolled ? colors.outlineVariant : "transparent"}`,
        boxShadow: scrolled ? colors.shadowSm : "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        backgroundImage: "none",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 }, gap: 1 }}>

        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            mr: 4,
            flexShrink: 0,
          }}
        >
          <HotelIcon sx={{ color: colors.accent, fontSize: 26 }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.125rem",
              color: colors.accent,
              letterSpacing: "-0.5px",
            }}
          >
            StayEase
          </Typography>
        </Box>

        {/* Nav links */}
        <Box component="nav" aria-label="Main navigation" sx={{ display: "flex", alignItems: "center", gap: 0.5, flexGrow: 1 }}>
          <Button component={Link} to="/" sx={navLinkSx(pathname === "/")}>Home</Button>

          {isAuthenticated && role === CONSTANTS.ROLES.GUEST && (
            <Button component={Link} to="/my-stays" sx={navLinkSx(pathname === "/my-stays")}>
              My Stays
            </Button>
          )}
          {role === CONSTANTS.ROLES.MANAGER && (
            <Button component={Link} to="/manager" sx={navLinkSx(pathname === "/manager")}>
              Dashboard
            </Button>
          )}
          {role === CONSTANTS.ROLES.ADMIN && (
            <Button component={Link} to="/admin/hotels" sx={navLinkSx(pathname === "/admin/hotels")}>
              Admin
            </Button>
          )}
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isAuthenticated && role && roleLabel[role] && (
            <Chip
              label={roleLabel[role]}
              size="small"
              sx={{
                bgcolor: colors.accentContainer,
                color: colors.accent,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 26,
                border: `1px solid ${colors.accentLight}`,
              }}
            />
          )}

          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: colors.onBackground,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome,{" "}
                <Typography component="span" sx={{ color: colors.accent, fontWeight: 700, fontSize: "inherit" }}>
                  {name ? name.split(" ")[0] : role}
                </Typography>
              </Typography>
              <Tooltip title="Sign out">
                <IconButton
                  onClick={() => {
                    logout();
                    toast.info("You have been logged out.");
                    navigate("/");
                  }}
                  size="small"
                  aria-label="Sign out"
                  sx={{
                    border: `1px solid ${colors.outlineVariant}`,
                    borderRadius: 2,
                    p: 0.75,
                    color: colors.onSurfaceVariant,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: colors.errorLight,
                      borderColor: colors.error,
                      color: colors.error,
                    },
                  }}
                >
                  <LogoutIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{
                  color: colors.onBackground,
                  borderColor: colors.outline,
                  borderRadius: 8,
                  px: 2,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  "&:hover": {
                    borderColor: colors.onBackground,
                    backgroundColor: colors.surfaceContainerLow,
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: colors.accent,
                  color: "#fff",
                  borderRadius: 8,
                  px: 2,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: colors.accentDark,
                    boxShadow: colors.shadowSm,
                    transform: "none",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
    </>
  );
}
