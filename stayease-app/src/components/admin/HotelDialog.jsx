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
        description: "",
        coverImageUrl: "",
        managerId: 2,
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

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Cover Image URL"
          error={!!errors.coverImageUrl}
          helperText={errors.coverImageUrl?.message}
          {...register("coverImageUrl", {
            required: "Cover image URL is required",
            pattern: {
              value: /^(https?:\/\/.*)$/i,
              message: "Please enter a valid image URL",
            },
          })}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Manager ID"
          type="number"
          error={!!errors.managerId}
          helperText={errors.managerId?.message}
          inputProps={{
            min: 1,
            max: 5,
          }}
          {...register("managerId", {
            required: "Manager ID is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Manager ID must be at least 1",
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
