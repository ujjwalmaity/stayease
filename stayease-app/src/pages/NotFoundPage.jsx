import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import colors from "../styles/colors";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        py: 4,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "6rem", md: "10rem" },
          fontWeight: 900,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${colors.accentContainer} 0%, ${colors.accent} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          mb: 1,
        }}
      >
        404
      </Typography>

      <Typography variant="h3" sx={{ fontWeight: 800, color: colors.onBackground, mb: 1 }}>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.7, mb: 2 }}>
        The page you're looking for may have been moved, deleted, or the URL might be incorrect.
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<HomeOutlinedIcon />}
        onClick={() => navigate("/")}
        sx={{
          borderRadius: 2,
          px: 4,
          py: 1.5,
          fontWeight: 700,
          bgcolor: colors.accent,
          color: "#fff",
          boxShadow: "none",
          "&:hover": { bgcolor: colors.accentDark, boxShadow: "none" },
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
}
