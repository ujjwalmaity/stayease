import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          width: "100%",
          borderRadius: 3,
          boxShadow: 2,
          borderTop: "6px solid #2e7d32",
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "70px",
              lineHeight: 1,
              mb: 2,
            }}
          >
            ✅
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#2e7d32",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Booking Confirmed!
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Thank you for choosing StayEase. Your reservation has been
            successfully confirmed.
          </Typography>

          <Box
            sx={{
              bgcolor: "#f1f8e9",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Booking Reference
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#2e7d32",
                mb: 3,
              }}
            >
              {booking.bookingRef}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Total Amount Paid
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#2e7d32",
                fontWeight: 700,
              }}
            >
              ₹{booking.totalPrice}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/")}
            >
              Back to Hotels
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
