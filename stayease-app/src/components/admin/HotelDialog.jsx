import { useEffect } from "react";
import {
  Dialog, DialogContent, DialogActions,
  Button, TextField, Typography, Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import colors from "../../styles/colors";

export default function HotelDialog({ open, title, onClose, onSubmit, defaultValues }) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isValid },
  } = useForm({ defaultValues, mode: "onChange" });

  useEffect(() => {
    reset(defaultValues || { name: "", city: "", starRating: 1, description: "", coverImageUrl: "", managerId: 2 });
  }, [defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Header */}
      <Box sx={{ bgcolor: colors.accent, px: 3, pt: 3, pb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BusinessOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>{title}</Typography>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth margin="normal" label="Hotel Name"
          error={!!errors.name} helperText={errors.name?.message}
          {...register("name", {
            required: "Hotel name is required",
            minLength: { value: 3, message: "At least 3 characters" },
            maxLength: { value: 100, message: "Max 100 characters" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="City"
          error={!!errors.city} helperText={errors.city?.message}
          {...register("city", {
            required: "City is required",
            minLength: { value: 2, message: "At least 2 characters" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="Star Rating" type="number"
          error={!!errors.starRating} helperText={errors.starRating?.message}
          inputProps={{ min: 1, max: 5 }}
          {...register("starRating", {
            required: "Star rating is required",
            valueAsNumber: true,
            min: { value: 1, message: "Min 1" },
            max: { value: 5, message: "Max 5" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="Description" multiline rows={3}
          error={!!errors.description} helperText={errors.description?.message}
          {...register("description", {
            required: "Description is required",
            minLength: { value: 10, message: "At least 10 characters" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="Cover Image URL"
          error={!!errors.coverImageUrl} helperText={errors.coverImageUrl?.message}
          {...register("coverImageUrl", {
            required: "Cover image URL is required",
            pattern: { value: /^(https?:\/\/.*)$/i, message: "Must be a valid URL" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="Manager ID" type="number"
          error={!!errors.managerId} helperText={errors.managerId?.message}
          inputProps={{ min: 1 }}
          {...register("managerId", {
            required: "Manager ID is required",
            valueAsNumber: true,
            min: { value: 1, message: "Must be at least 1" },
          })}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined" color="error"
          startIcon={<CancelIcon />}
          onClick={onClose}
          sx={{ borderRadius: 8, flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          sx={{
            borderRadius: 8, flex: 2,
            bgcolor: colors.accent,
          }}
        >
          Save Hotel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
