import { Container, Paper, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      auth.login(response.token, response.role);
      toast.success("Account created");
      navigate("/");
    } catch {
      toast.error("Registration failed");
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
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", {
              required: "Name is required",
            })}
          />
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
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Button fullWidth variant="contained" type="submit" disabled={!isValid} sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
