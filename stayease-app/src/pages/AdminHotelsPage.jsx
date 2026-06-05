import { useEffect, useState } from "react";
import { Typography, Button, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";
import {
  getAllHotels,
  deleteHotel,
  updateHotel,
  createHotel,
} from "../services/hotelService";
import HotelsTable from "../components/admin/HotelsTable";
import HotelDialog from "../components/admin/HotelDialog";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const loadHotels = async () => {
    try {
      const result = await getAllHotels();
      setHotels(result);
    } catch {
      toast.error("Unable to load hotels");
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleCreate = () => {
    setSelectedHotel(null);
    setDialogOpen(true);
  };

  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete hotel?")) {
      return;
    }

    try {
      await deleteHotel(id);
      toast.success("Hotel deleted");
      loadHotels();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Hotel Management
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleCreate}>
          Create Hotel
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <HotelsTable
          hotels={hotels}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <HotelDialog
        open={dialogOpen}
        title={selectedHotel ? "Edit Hotel" : "Create Hotel"}
        defaultValues={selectedHotel || {}}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (data) => {
            try {
                console.log(data);
                if (selectedHotel) {
                  await updateHotel(selectedHotel.id, data);
                  toast.success("Hotel updated successfully");
                } else {
                  await createHotel(data);
                  toast.success("Hotel created successfully");
                }
                setDialogOpen(false);
                loadHotels();
            } catch {
                toast.error(selectedHotel ? "Failed to update hotel" : "Failed to create hotel");
            }
        }}
      />
    </>
  );
}
