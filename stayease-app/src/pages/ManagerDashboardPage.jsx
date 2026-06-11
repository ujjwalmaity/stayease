import { useEffect, useState } from "react";
import { Typography, CircularProgress, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { getUpcomingBookings } from "../services/managerService";
import { getManagerRooms, toggleRoomStatus } from "../services/roomService";
import UpcomingBookings from "../components/manager/UpcomingBookings";
import RoomsTable from "../components/manager/RoomsTable";

export default function ManagerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(false);

  const loadData = async () => {
    try {
      const [bookingsResult, roomsResult] = await Promise.all([
        getUpcomingBookings(),
        getManagerRooms(),
      ]);
      setBookings(bookingsResult);
      setRooms(roomsResult);
    } catch (error) {
      setError(true);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (roomId) => {
    try {
      await toggleRoomStatus(roomId);
      await loadData();
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
        Manager Dashboard
      </Typography>

      {!error && (
        <Paper
          sx={{
            p: 2,
            mb: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            My Rooms
          </Typography>
            <RoomsTable
              rooms={rooms}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggle={handleToggle}
            />
        </Paper>
        )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upcoming Bookings
        </Typography>
        <UpcomingBookings bookings={bookings} />
      </Paper>
    </>
  );
}
