import { useEffect, useState } from "react";
import { Typography, Button, Paper, Box } from "@mui/material";
import { toast } from "sonner";
import { getAllHotels, deleteHotel, updateHotel, createHotel } from "../services/hotelService";
import HotelsTable from "../components/admin/HotelsTable";
import HotelDialog from "../components/admin/HotelDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import AddIcon from "@mui/icons-material/Add";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import colors from "../styles/colors";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const loadHotels = async () => {
    try { setHotels(await getAllHotels()); }
    catch (err) { toast.error(err.message); }
  };

  useEffect(() => { loadHotels(); }, []);

  const handleEdit = (hotel) => { setSelectedHotel(hotel); setDialogOpen(true); };
  const handleCreate = () => { setSelectedHotel(null); setDialogOpen(true); };
  const handleDelete = async (id) => {
    try { await deleteHotel(id); toast.success("Hotel deleted"); loadHotels(); }
    catch (err) { toast.error(err.message); }
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: colors.onBackground }}>Hotel Management</Typography>
          <Typography sx={{ color: colors.onSurfaceVariant, fontSize: "0.9375rem" }}>
            {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} in the directory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            borderRadius: 8,
            px: 3,
            py: 1.25,
            fontWeight: 700,
            bgcolor: colors.accent,
            color: "#fff",
            boxShadow: "none",
            "&:hover": { bgcolor: colors.accentDark, boxShadow: colors.shadowSm, transform: "none" },
          }}
        >
          Create Hotel
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${colors.outlineVariant}`,
          boxShadow: colors.shadowSm,
        }}
      >
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            px: 3, py: 2.5,
            borderBottom: `1px solid ${colors.outlineVariant}`,
            bgcolor: colors.surfaceContainerLow,
          }}
        >
          <BusinessOutlinedIcon sx={{ color: colors.accent }} />
          <Typography variant="h6">All Hotels</Typography>
        </Box>
        <HotelsTable hotels={hotels} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
      </Paper>

      <HotelDialog
        open={dialogOpen}
        title={selectedHotel ? "Edit Hotel" : "Create Hotel"}
        defaultValues={selectedHotel || {}}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (data) => {
          try {
            if (selectedHotel) { await updateHotel(selectedHotel.id, data); toast.success("Hotel updated"); }
            else { await createHotel(data); toast.success("Hotel created"); }
            setDialogOpen(false);
            loadHotels();
          } catch (err) { toast.error(err.message); }
        }}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete hotel?"
        description="This will permanently remove the hotel and all its data."
        confirmLabel="Delete"
        onConfirm={() => { handleDelete(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
