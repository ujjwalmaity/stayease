import { useEffect, useState } from "react";
import { Typography, CircularProgress, Paper, Button, Box, Grid } from "@mui/material";
import { toast } from "sonner";
import { getUpcomingBookings } from "../services/managerService";
import { getManagerRooms, getManagerHotels, createRoom, updateRoom, deleteRoom, toggleRoomStatus } from "../services/roomService";
import UpcomingBookings from "../components/manager/UpcomingBookings";
import RoomsTable from "../components/manager/RoomsTable";
import RoomDialog from "../components/manager/RoomDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import AddIcon from "@mui/icons-material/Add";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import colors from "../styles/colors";

const StatCard = ({ icon, label, value, color }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      border: `1px solid ${colors.outlineVariant}`,
      boxShadow: colors.shadowSm,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 52, height: 52, borderRadius: "14px",
        bgcolor: color + "20",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color, lineHeight: 1.1 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
    </Box>
  </Paper>
);

export default function ManagerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteRoomId, setDeleteRoomId] = useState(null);

  const loadData = async () => {
    try {
      const [bookingsResult, roomsResult, hotelsResult] = await Promise.all([
        getUpcomingBookings(),
        getManagerRooms(),
        getManagerHotels(),
      ]);
      setBookings(bookingsResult);
      setRooms(roomsResult);
      setHotels(hotelsResult.map((h) => ({ id: h.id, name: h.name })));
    } catch (err) {
      setError(true);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit = (room) => { setSelectedRoom(room); setDialogOpen(true); };
  const handleCreate = () => { setSelectedRoom(null); setDialogOpen(true); };

  const handleDelete = async (roomId) => {
    try { await deleteRoom(roomId); toast.success("Room deleted"); loadData(); }
    catch (err) { toast.error(err.message); }
  };

  const handleToggle = async (room) => {
    try { await toggleRoomStatus(room.id, !room.isActive); loadData(); }
    catch (err) { toast.error(err.message); }
  };

  const handleDialogSubmit = async (data) => {
    const { hotelId, ...roomData } = data;
    const payload = { ...roomData, pricePerNight: Number(data.pricePerNight), maxOccupancy: Number(data.maxOccupancy) };
    try {
      if (selectedRoom) { await updateRoom(selectedRoom.id, payload); toast.success("Room updated"); }
      else { await createRoom(Number(data.hotelId), payload); toast.success("Room created"); }
      setDialogOpen(false);
      loadData();
    } catch (err) { toast.error(err.message); }
  };

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  const activeRooms = rooms.filter((r) => r.isActive).length;
  const upcomingCount = bookings.filter((b) => new Date(b.checkInDate) >= new Date()).length;

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
        <Typography variant="h3" sx={{ color: colors.onBackground, fontWeight: 800, mb: 0.5 }}>Manager Dashboard</Typography>
        <Typography sx={{ color: colors.onSurfaceVariant, fontSize: "0.9375rem" }}>
          Manage your rooms and monitor upcoming reservations
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<MeetingRoomOutlinedIcon sx={{ color: colors.accent, fontSize: 26 }} />}
            label="Total Rooms"
            value={rooms.length}
            color={colors.accent}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<CheckCircleOutlineIcon sx={{ color: colors.success, fontSize: 26 }} />}
            label="Active Rooms"
            value={activeRooms}
            color={colors.success}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<EventNoteOutlinedIcon sx={{ color: colors.secondary, fontSize: 26 }} />}
            label="Upcoming Bookings"
            value={upcomingCount}
            color={colors.secondary}
          />
        </Grid>
      </Grid>

      {/* Rooms section */}
      {!error && (
        <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 4, border: `1px solid ${colors.outlineVariant}`, boxShadow: colors.shadowSm }}>
          <Box
            sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              px: 3, py: 2.5,
              borderBottom: `1px solid ${colors.outlineVariant}`,
              bgcolor: colors.surfaceContainerLow,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <MeetingRoomOutlinedIcon sx={{ color: colors.accent }} />
              <Typography variant="h6">My Rooms</Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                borderRadius: 8,
                bgcolor: colors.accent,
                color: "#fff",
                boxShadow: "none",
                "&:hover": { bgcolor: colors.accentDark, boxShadow: "none" },
              }}
            >
              Add Room
            </Button>
          </Box>
          <RoomsTable rooms={rooms} onEdit={handleEdit} onDelete={(id) => setDeleteRoomId(id)} onToggle={handleToggle} />
        </Paper>
      )}

      {/* Bookings section */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${colors.outlineVariant}`, boxShadow: colors.shadowSm }}>
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 3, py: 2.5,
            borderBottom: `1px solid ${colors.outlineVariant}`,
            bgcolor: colors.surfaceContainerLow,
          }}
        >
          <EventNoteOutlinedIcon sx={{ color: colors.secondary }} />
          <Typography variant="h6">Upcoming Bookings</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <UpcomingBookings bookings={bookings} />
        </Box>
      </Paper>

      <RoomDialog
        open={dialogOpen}
        title={selectedRoom ? "Edit Room" : "Add Room"}
        defaultValues={selectedRoom || {}}
        hotels={hotels}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />

      <ConfirmDialog
        open={!!deleteRoomId}
        title="Delete this room?"
        description="This will permanently remove the room."
        confirmLabel="Delete"
        onConfirm={() => { handleDelete(deleteRoomId); setDeleteRoomId(null); }}
        onCancel={() => setDeleteRoomId(null)}
      />
    </Box>
  );
}
