import { useEffect, useState } from "react";
import { Typography, Box, Paper, Button } from "@mui/material";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import BookingTable from "../components/booking/BookingTable";
import LuggageIcon from "@mui/icons-material/Luggage";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import colors from "../styles/colors";

export default function MyStaysPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);
  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled");
      await loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ pb: { xs: 3, md: 4 }, pt: { xs: 2, md: 3 } }}>
      {/* Page header */}
      <Box
        sx={{
          bgcolor: colors.surfaceContainerLow,
          border: `1px solid ${colors.outlineVariant}`,
          borderRadius: 3,
          px: { xs: 3, md: 5 },
          py: { xs: 3, md: 4 },
          mb: 4,
        }}
      >
        <Typography variant="h3" sx={{ color: colors.onBackground, fontWeight: 800, mb: 0.5 }}>My Stays</Typography>
        <Typography sx={{ color: colors.onSurfaceVariant, fontSize: "0.9375rem" }}>
          {loading
            ? "Loading your bookings…"
            : bookings.length > 0
              ? `You have ${bookings.length} booking${bookings.length > 1 ? "s" : ""}`
              : "Manage all your hotel bookings"}
        </Typography>
      </Box>

      {loading ? (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${colors.outlineVariant}`,
            boxShadow: colors.shadowSm,
          }}
        >
          <BookingTable loading />
        </Paper>
      ) : bookings.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "30vh",
            gap: 2.5,
            bgcolor: colors.surface,
            borderRadius: 4,
            border: `2px dashed ${colors.outlineVariant}`,
            p: 6,
          }}
        >
          <Box
            sx={{
              width: 80, height: 80, borderRadius: "50%",
              bgcolor: colors.accentContainer,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <LuggageIcon sx={{ fontSize: 40, color: colors.accent }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>No bookings yet</Typography>
          <Typography color="text.secondary" align="center" sx={{ maxWidth: 360 }}>
            You haven't made any bookings yet. Start exploring hotels and book your next adventure.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<ExploreOutlinedIcon />}
            sx={{
              mt: 1,
              borderRadius: 2,
              px: 4,
              bgcolor: colors.accent,
              color: "#fff",
              boxShadow: "none",
              "&:hover": { bgcolor: colors.accentDark },
            }}
          >
            Browse Hotels
          </Button>
        </Box>
      ) : (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${colors.outlineVariant}`,
            boxShadow: colors.shadowSm,
          }}
        >
          <BookingTable bookings={bookings} onCancel={handleCancel} />
        </Paper>
      )}
    </Box>
  );
}
