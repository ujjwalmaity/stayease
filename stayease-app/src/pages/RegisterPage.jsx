import {
  Box, Paper, TextField, Button, Typography,
  IconButton, InputAdornment, Divider, CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import colors from "../styles/colors";
import { scaleIn, fadeUp, duration, ease, useReducedMotion } from "../theme/animations";

export default function RegisterPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const reduced = useReducedMotion();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await registerUser(data);
      auth.login(response.token, response.role, response.userId, response.name);
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: { lg: 3, md: 2 },
      overflow: "hidden",
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
            width: "38%",
            flexShrink: 0,
            background: `linear-gradient(160deg, ${colors.accent} 0%, ${colors.accentDark} 60%, #222 100%)`,
            px: 4,
            py: 4,
            textAlign: "center",
          }}
        >
          <Box sx={{
            width: 52, height: 52, borderRadius: "14px",
            bgcolor: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            mb: 2,
          }}>
            <HotelIcon sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, mb: 1 }}>Join StayEase</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.875rem", lineHeight: 1.5 }}>
            Create your account and start booking your dream hotels today.
          </Typography>
        </Box>

        {/* ── Form panel ── */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, sm: 3 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            animation: reduced ? "none" : `${fadeUp} ${duration.enter}ms ${duration.fast}ms ${ease.out} both`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.25 }}>Create account</Typography>
          <Typography color="text.secondary" sx={{ mb: 1.5, fontSize: "0.875rem" }}>
            Fill in your details to get started
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth margin="dense" label="Full Name" autoComplete="name"
              error={!!errors.name} helperText={errors.name?.message}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ fontSize: 18, color: colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
              } }}
              {...register("name", { required: "Name is required" })}
            />
            <TextField
              fullWidth margin="dense" label="Email address" autoComplete="email"
              error={!!errors.email} helperText={errors.email?.message}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: errors.email ? colors.error : colors.onSurfaceVariant }} />
                  </InputAdornment>
                ),
              } }}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
            />
            <TextField
              fullWidth margin="dense" label="Password" autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              error={!!errors.password} helperText={errors.password?.message}
              slotProps={{ input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: errors.password ? colors.error : colors.onSurfaceVariant }} />
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
              fullWidth variant="contained" type="submit"
              disabled={!isValid || submitting} size="medium"
              sx={{
                mt: 1.5, py: 1.25, borderRadius: 2, fontSize: "0.9375rem", fontWeight: 700,
                bgcolor: colors.accent,
                color: "#fff",
                boxShadow: "none",
                "&:hover": { bgcolor: colors.accentDark, boxShadow: "none" },
                "&:active": { transform: "scale(0.985)" },
                "&.Mui-disabled": { bgcolor: colors.surfaceContainerHigh },
              }}
            >
              {submitting
                ? <CircularProgress size={20} thickness={3} sx={{ color: "#fff" }} />
                : "Create Account"
              }
            </Button>
          </form>

          <Divider sx={{ my: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>OR</Typography>
          </Divider>

          <Typography variant="body2" align="center" color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: colors.accent, textDecoration: "none", fontWeight: 700 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
