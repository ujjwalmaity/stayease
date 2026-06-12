import {
  Box, Paper, TextField, Button, Typography,
  IconButton, InputAdornment, Divider, CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HotelIcon from "@mui/icons-material/Hotel";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import colors from "../styles/colors";
import { scaleIn, fadeUp, duration, ease, useReducedMotion } from "../theme/animations";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const reduced = useReducedMotion();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await login(data);
      auth.login(response.token, response.role, response.userId, response.name);
      toast.success("Login successful");
      if (response.role === "ADMIN") navigate("/admin/hotels");
      else if (response.role === "MANAGER") navigate("/manager");
      else {
        const saved = sessionStorage.getItem("bookingRedirect");
        if (saved) {
          const { hotelId, checkInDate, checkOutDate } = JSON.parse(saved);
          sessionStorage.removeItem("bookingRedirect");
          navigate(`/hotels/${hotelId}`, { state: { checkInDate, checkOutDate } });
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // flex:1 fills the remaining height provided by MainLayout — no overflow
    <Box sx={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      paddingTop: { lg: 3, md: 2 }, 
    }}>
      <Paper
        sx={{
          width: "100%",
          maxWidth: 860,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: colors.shadowXl,
          display: "flex",
          border: `1px solid ${colors.outlineVariant}`,
          animation: reduced ? "none" : `${scaleIn} ${duration.enter}ms ${ease.out} both`,
        }}
      >
        {/* ── Brand panel ── */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "42%",
            flexShrink: 0,
            background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.accentDark} 60%, #222 100%)`,
            px: 5,
            py: 6,
            textAlign: "center",
          }}
        >
          <Box sx={{
            width: 64, height: 64, borderRadius: "16px",
            bgcolor: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            mb: 2.5,
          }}>
            <HotelIcon sx={{ fontSize: 34, color: "#fff" }} />
          </Box>
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, mb: 1 }}>StayEase</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
            Book your perfect stay with the best prices guaranteed.
          </Typography>
        </Box>

        {/* ── Form panel ── */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            animation: reduced ? "none" : `${fadeUp} ${duration.enter}ms ${duration.fast}ms ${ease.out} both`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Welcome back</Typography>
          <Typography color="text.secondary" sx={{ mb: 3, fontSize: "0.9375rem" }}>
            Sign in to your account to continue
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              label="Email address"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 20, color: errors.email ? colors.error : colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
              } }}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 20, color: errors.password ? colors.error : colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              } }}
              {...register("password", { required: "Password is required" })}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!isValid || submitting}
              size="large"
              sx={{
                mt: 2.5,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 700,
                bgcolor: colors.accent,
                color: "#fff",
                boxShadow: "none",
                "&:hover": { bgcolor: colors.accentDark, boxShadow: "none" },
                "&:active": { transform: "scale(0.985)" },
                "&.Mui-disabled": { bgcolor: colors.surfaceContainerHigh },
              }}
            >
              {submitting
                ? <CircularProgress size={22} thickness={3} sx={{ color: "#fff" }} />
                : "Sign In"
              }
            </Button>
          </form>

          <Divider sx={{ my: 2.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>OR</Typography>
          </Divider>

          <Typography variant="body2" align="center" color="text.secondary">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: colors.accent, textDecoration: "none", fontWeight: 700 }}>
              Create account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
