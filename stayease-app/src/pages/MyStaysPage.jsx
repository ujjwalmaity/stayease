import { useEffect, useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/bookingService";
import BookingTable from "../components/booking/BookingTable";
import { useAuth } from "../context/AuthContext";

export default function MyStaysPage() {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const loadBookings = async () => {
    try {
      const data = await getMyBookings(auth.userId);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, { userId: auth.userId });
      toast.success("Booking cancelled");
      await loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Stays
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View and manage your hotel bookings
      </Typography>
      {bookings.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
          <Typography variant="h6" gutterBottom>
            No Bookings Found.
          </Typography>
          <Link to="/" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>
            Book your stay here
          </Link>
        </Box>
      ) : (
        <BookingTable bookings={bookings} onCancel={handleCancel} />
      )}
    </>
  );
}
