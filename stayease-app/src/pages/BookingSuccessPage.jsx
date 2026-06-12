import { Box, Button, Card, CardContent, Divider, Typography, Stack, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import colors from "../styles/colors";
import dayjs from "dayjs";

export default function BookingSuccessPage() {
  const { state: booking } = useLocation();
  const navigate = useNavigate();

  const details = [
    ["Hotel", booking?.hotelName],
    ["Room Type", booking?.roomType],
    ["Check-In",  booking?.checkInDate  ? dayjs(booking.checkInDate).format("DD MMM YYYY")  : "—"],
    ["Check-Out", booking?.checkOutDate ? dayjs(booking.checkOutDate).format("DD MMM YYYY") : "—"],
  ];

  return (
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", py: 3 }}>
      <Card
        sx={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: colors.shadowXl,
          border: `1px solid ${colors.outlineVariant}`,
        }}
      >
        {/* Success header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${colors.success} 0%, #1B5E20 100%)`,
            py: 4,
            px: 4,
            textAlign: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 64, color: "#fff", mb: 1.5, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} />
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, mb: 0.5 }}>Booking Confirmed!</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9375rem" }}>
            Thank you for choosing StayEase
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Booking reference pill */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: colors.successLight,
              borderRadius: 2.5,
              p: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ConfirmationNumberOutlinedIcon sx={{ color: colors.success, fontSize: 22 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Booking Reference</Typography>
            </Box>
            <Chip
              label={booking?.bookingRef}
              sx={{
                bgcolor: colors.success,
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                fontFamily: "monospace",
              }}
            />
          </Box>

          {/* Detail rows */}
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {details.map(([label, value]) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={600}>{value}</Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          {/* Total */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5 }}>
            <Typography variant="h6" fontWeight={700}>Total Paid</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: colors.success }}>
              ₹{Number(booking?.totalPrice).toLocaleString()}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 700,
              bgcolor: colors.accent,
              color: "#fff",
              boxShadow: "none",
              "&:hover": { bgcolor: colors.accentDark, boxShadow: "none" },
            }}
          >
            Browse More Hotels
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
