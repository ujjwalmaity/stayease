import { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
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
    } catch {
      toast.error("Unable to cancel booking");
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
      <BookingTable bookings={bookings} onCancel={handleCancel} />
    </>
  );
}
