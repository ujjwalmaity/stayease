import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Typography, Chip, Stack, Divider,
  CircularProgress, Alert, Paper, Skeleton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import CONSTANTS from "../utils/constants";
import { getHotelById } from "../services/hotelService";
import { getAvailableRooms } from "../services/roomService";
import { createBooking } from "../services/bookingService";
import AvailabilitySearch from "../components/room/AvailabilitySearch";
import AvailableRoomsTable from "../components/room/AvailableRoomsTable";
import BookingDialog from "../components/booking/BookingDialog";
import colors from "../styles/colors";

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialCheckIn = location.state?.checkInDate || "";
  const initialCheckOut = location.state?.checkOutDate || "";
  const auth = useAuth();
  const [hotel, setHotel] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const searchRooms = useCallback(async (checkIn, checkOut) => {
    if (!id) return;
    try {
      setLoading(true);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      setRooms(await getAvailableRooms(id, checkIn, checkOut));
      setSearched(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (hotel && initialCheckIn && initialCheckOut) searchRooms(initialCheckIn, initialCheckOut);
  }, [hotel, initialCheckIn, initialCheckOut, searchRooms]);

  useEffect(() => {
    if (!id) return;
    const loadHotel = async () => {
      try { setHotel(await getHotelById(id)); }
      catch (error) { toast.error(error.message); }
      finally { setHotelLoading(false); }
    };
    loadHotel();
  }, [id]);

  const calculateNights = () => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const bookRoom = (room) => {
    if (!auth.isAuthenticated) {
      sessionStorage.setItem("bookingRedirect", JSON.stringify({ hotelId: id, checkInDate, checkOutDate }));
      navigate("/login");
      return;
    }
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedRoom) return;
    try {
      const booking = await createBooking({ roomId: selectedRoom.id, hotelId: hotel.id, checkInDate, checkOutDate });
      toast.success("Booking successful");
      navigate("/booking-success", { state: booking });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ pb: { xs: 3, md: 4 }, pt: { xs: 2, md: 3 } }}>
      {hotel && (
        <>
          {/* ── Full-bleed hero image ─────────────────────── */}
          <Box
            sx={{
              position: "relative",
              height: { xs: 240, sm: 320, md: 420 },
              borderRadius: 4,
              overflow: "hidden",
              mb: 3,
              boxShadow: colors.shadowLg,
              bgcolor: "grey.200",
            }}
          >
            {hotelLoading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            ) : (
              <Box
                component="img"
                src={hotel.coverImageUrl}
                alt={hotel.name}
                loading="eager"
                decoding="async"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {/* Gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.1) 50%, transparent 100%)",
              }}
            />
            {/* Hotel name on image */}
            <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: { xs: 2.5, md: 4 } }}>
              <Typography
                variant="h2"
                sx={{ color: "#fff", fontWeight: 800, textShadow: "0 2px 8px rgba(0,0,0,0.4)", mb: 1 }}
              >
                {hotel.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocationOnIcon sx={{ fontSize: 18, color: colors.accentLight }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{hotel.city}</Typography>
                </Stack>
                <Stack
                  direction="row" alignItems="center" spacing={0.5}
                  role="img"
                  aria-label={`${hotel.starRating}-star hotel`}
                >
                  {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                    <StarIcon key={i} aria-hidden="true" sx={{ fontSize: 16, color: colors.accent }} />
                  ))}
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem" }}>
                    {hotel.starRating}-Star Hotel
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* ── Hotel info card ───────────────────────────── */}
          <Paper
            sx={{
              borderRadius: 3,
              p: { xs: 2.5, md: 4 },
              mb: 3,
              boxShadow: colors.shadowSm,
              border: `1px solid ${colors.outlineVariant}`,
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8, maxWidth: 800 }}>
              {hotel.description}
            </Typography>

            {hotel.amenities?.length > 0 && (
              <>
                <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 700, mb: 1.5, display: "block" }}>
                  Amenities
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  {hotel.amenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      variant="outlined"
                      size="small"
                      sx={{ borderColor: colors.secondary, color: colors.secondaryDark, fontWeight: 500 }}
                    />
                  ))}
                </Stack>
              </>
            )}
          </Paper>
        </>
      )}

      {/* ── Availability section ──────────────────────── */}
      <Paper
        sx={{
          borderRadius: 3,
          p: { xs: 2.5, md: 4 },
          boxShadow: colors.shadowSm,
          border: `1px solid ${colors.outlineVariant}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: "10px",
              bgcolor: colors.accentContainer,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <CalendarMonthIcon sx={{ color: colors.accent, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Check Availability</Typography>
            <Typography variant="caption" color="text.secondary">Select dates to see available rooms</Typography>
          </Box>
        </Stack>

        <AvailabilitySearch
          onSearch={searchRooms}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
        />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={36} />
          </Box>
        )}
        {!loading && searched && rooms.length === 0 && (
          <Alert severity="info" sx={{ borderRadius: 2, mt: 1 }}>No rooms available for those dates.</Alert>
        )}
        {rooms.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 700, mb: 2, display: "block" }}>
              {rooms.length} Room{rooms.length > 1 ? "s" : ""} Available
            </Typography>
            <AvailableRoomsTable
              rooms={rooms}
              onBook={bookRoom}
              canBook={auth.role === CONSTANTS.ROLES.GUEST || !auth.isAuthenticated}
            />
          </>
        )}
      </Paper>

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
    </Box>
  );
}
