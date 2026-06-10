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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClic={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          startIcon={<CheckCircleIcon />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
