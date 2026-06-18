import { useEffect } from "react";
import {
  Dialog, DialogContent, DialogActions,
  TextField, Button, MenuItem, Typography, Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import colors from "../../styles/colors";

const ROOM_TYPES = ["SINGLE", "DOUBLE", "SUITE"];

export default function RoomDialog({ open, title, defaultValues, hotels = [], onSubmit, onClose }) {
  const {
    register, handleSubmit, reset, control,
    formState: { errors, isValid },
  } = useForm({ defaultValues, mode: "onChange" });

  useEffect(() => { reset(defaultValues || {}); }, [defaultValues, reset]);

  const isCreating = !defaultValues?.id;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ bgcolor: colors.accent, px: 3, pt: 3, pb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MeetingRoomOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>{title}</Typography>
      </Box>

      <DialogContent sx={{ pt: 3 }}>

        {/* Hotel selector — Controller so MUI Select onChange is tracked */}
        {isCreating && (
          <Controller
            name="hotelId"
            control={control}
            defaultValue=""
            rules={{ required: "Please select a hotel" }}
            render={({ field }) => (
              <TextField
                {...field}
                select fullWidth margin="normal" label="Hotel"
                error={!!errors.hotelId}
                helperText={errors.hotelId?.message}
              >
                {hotels.map((h) => (
                  <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
        )}

        <TextField
          fullWidth margin="normal" label="Room Number"
          error={!!errors.roomNumber} helperText={errors.roomNumber?.message}
          {...register("roomNumber", { required: "Room number is required" })}
        />

        {/* Room Type — Controller so MUI Select onChange is tracked */}
        <Controller
          name="roomType"
          control={control}
          defaultValue={defaultValues?.roomType || ""}
          rules={{ required: "Room type is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select fullWidth margin="normal" label="Room Type"
              error={!!errors.roomType}
              helperText={errors.roomType?.message}
            >
              {ROOM_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          fullWidth margin="normal" label="Price Per Night (₹)" type="number"
          error={!!errors.pricePerNight} helperText={errors.pricePerNight?.message}
          {...register("pricePerNight", {
            required: "Price is required",
            min: { value: 1, message: "Price must be greater than 0" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="Max Occupancy" type="number"
          error={!!errors.maxOccupancy} helperText={errors.maxOccupancy?.message}
          {...register("maxOccupancy", {
            required: "Max occupancy is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
        />
        <TextField
          fullWidth margin="normal" label="Description" multiline rows={2}
          {...register("description")}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={onClose} sx={{ borderRadius: 8, flex: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained" startIcon={<CheckCircleIcon />}
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
          sx={{ borderRadius: 8, flex: 2, bgcolor: colors.accent }}
        >
          Save Room
        </Button>
      </DialogActions>
    </Dialog>
  );
}
