import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Box, Divider, Stack, Grow,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import colors from "../../styles/colors";
import { useReducedMotion } from "../../theme/animations";

const Row = ({ label, value, bold }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={bold ? 700 : 500}>{value}</Typography>
  </Box>
);

export default function BookingDialog({ open, roomType, price, nights, total, onClose, onConfirm }) {
  const reduced = useReducedMotion();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-describedby="booking-summary"
      TransitionComponent={reduced ? undefined : Grow}
      TransitionProps={{ timeout: 220 }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: colors.accent, px: 3, pt: 3, pb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HotelIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: "#fff", lineHeight: 1.2 }}>Confirm Booking</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>Review your booking details</Typography>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          id="booking-summary"
          sx={{
            bgcolor: colors.surfaceContainerLow,
            borderRadius: 3,
            p: 2.5,
            border: `1px solid ${colors.outlineVariant}`,
          }}
        >
          <Stack spacing={1.75}>
            <Row label="Room Type" value={roomType} bold />
            <Row label="Price per Night" value={`₹${Number(price).toLocaleString()}`} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <NightsStayIcon sx={{ fontSize: 16, color: colors.onSurfaceVariant }} />
                <Typography variant="body2" color="text.secondary">Nights</Typography>
              </Box>
              <Typography variant="body2" fontWeight={500}>{nights}</Typography>
            </Box>

            <Divider />

            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: colors.accentContainer,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700} color={colors.accentDark}>Total</Typography>
              <Typography variant="h5" fontWeight={800} color={colors.accent}>
                ₹{Number(total).toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={onClose}
          sx={{ borderRadius: 8, flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={onConfirm}
          sx={{
            borderRadius: 8,
            flex: 2,
            bgcolor: colors.accent,
            boxShadow: `0 4px 14px rgba(255,90,95,0.3)`,
          }}
        >
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
}
