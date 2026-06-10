import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <HotelIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>
            Confirm Booking
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            bgcolor: "#f8fafc",
            borderRadius: 3,
            p: 3,
            border: "1px solid #e2e8f0",
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography color="text.secondary">Room Type</Typography>
              <Typography fontWeight={600}>{roomType}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography color="text.secondary">Price / Night</Typography>
              <Typography fontWeight={600}>
                ₹{price.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography color="text.secondary">Number of Nights</Typography>
              <Typography fontWeight={600}>{nights}</Typography>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor: "#e3f2fd",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Total Amount
              </Typography>

              <Typography variant="h5" fontWeight={700} color="primary.main">
                ₹{total.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={onConfirm}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
          }}
        >
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
}
