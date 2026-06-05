import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

export default function BookingDialog({
  open,
  roomType,
  price,
  nights,
  total,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Booking</DialogTitle>
      <DialogContent>
        <Typography>Room: {roomType}</Typography>
        <Typography>Price/Night: ₹{price}</Typography>
        <Typography>Nights: {nights}</Typography>
        <Typography variant="h6">Total: ₹{total}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
