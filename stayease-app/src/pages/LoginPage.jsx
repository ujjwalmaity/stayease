import { Container, Paper, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      auth.login(response.token, response.role, response.userId);
      toast.success("Login successful");
      navigate("/");
    } catch {
      toast.error("Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        sx={{
          p: 4,
          m: 8,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={!isValid}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
