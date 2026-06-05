import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getHotelById } from "../services/hotelService";
import { getAvailableRooms } from "../services/roomService";
import { createBooking } from "../services/bookingService";
import AvailabilitySearch from "../components/room/AvailabilitySearch";
import AvailableRoomsTable from "../components/room/AvailableRoomsTable";
import BookingDialog from "../components/booking/BookingDialog";

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    if (!id) return;
    const loadHotel = async () => {
      try {
        const result = await getHotelById(id);
        setHotel(result);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load hotel");
      }
    };
    loadHotel();
  }, [id]);

  const searchRooms = async (checkIn, checkOut) => {
    if (!id) return;
    try {
      setLoading(true);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      const result = await getAvailableRooms(id, checkIn, checkOut);
      setRooms(result);
      setSearched(true);
    } catch {
      toast.error("Unable to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const bookRoom = (room) => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedRoom) {
      return;
    }
    try {
      const booking = await createBooking({
        roomId: selectedRoom.id,
        checkInDate,
        checkOutDate,
      });
      toast.success("Booking successful");
      navigate("/booking-success", {
        state: booking,
      });
    } catch {
      toast.error("Booking failed");
    }
  };

  return (
    <>
      {hotel && (
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="350"
            image={hotel.coverImageUrl}
            alt={hotel.name}
          />

          <CardContent>
            <Typography variant="h4" gutterBottom>
              {hotel.name}
            </Typography>

            <Typography color="text.secondary" component="p" sx={{ mb: 2 }}>
              {hotel.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {hotel.amenities?.map((amenity) => (
                <Chip key={amenity} label={amenity} sx={{ mb: 1 }} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Available Rooms
      </Typography>
      <AvailabilitySearch onSearch={searchRooms} />
      {loading && <CircularProgress />}
      {!loading && searched && rooms.length === 0 && (
        <Alert severity="info">No rooms available</Alert>
      )}
      {rooms.length > 0 && (
        <AvailableRoomsTable rooms={rooms} onBook={bookRoom} />
      )}
      {selectedRoom && (
        <BookingDialog
          open={dialogOpen}
          roomType={selectedRoom.roomType}
          price={selectedRoom.pricePerNight}
          nights={calculateNights()}
          total={selectedRoom.pricePerNight * calculateNights()}
          onClose={() => setDialogOpen(false)}
          onConfirm={confirmBooking}
        />
      )}
    </>
  );
}
