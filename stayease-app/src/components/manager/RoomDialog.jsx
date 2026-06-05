import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function RoomDialog({
  open,
  title,
  defaultValues,
  onSubmit,
  onClose,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Room Number"
          {...register("roomNumber")}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Room Type"
          {...register("roomType")}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Price"
          type="number"
          {...register("pricePerNight")}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Max Occupancy"
          type="number"
          {...register("maxOccupancy")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
