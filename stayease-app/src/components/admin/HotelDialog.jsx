import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function HotelDialog({
  open,
  title,
  onClose,
  onSubmit,
  defaultValues,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    reset(
      defaultValues || {
        name: "",
        city: "",
        starRating: 1,
      },
    );
  }, [defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Hotel Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name", {
            required: "Hotel name is required",
            minLength: {
              value: 3,
              message: "Hotel name must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Hotel name cannot exceed 100 characters",
            },
          })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="City"
          error={!!errors.city}
          helperText={errors.city?.message}
          {...register("city", {
            required: "City is required",
            minLength: {
              value: 2,
              message: "City must be at least 2 characters",
            },
          })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Star Rating"
          type="number"
          error={!!errors.starRating}
          helperText={errors.starRating?.message}
          inputProps={{
            min: 1,
            max: 5,
          }}
          {...register("starRating", {
            required: "Star rating is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Star rating must be at least 1",
            },
            max: {
              value: 5,
              message: "Star rating cannot exceed 5",
            },
          })}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
