import { Alert, CircularProgress, Typography, Box } from "@mui/material";
import { useState } from "react";
import SearchForm from "../components/hotel/SearchForm";
import HotelGrid from "../components/hotel/HotelGrid";
import { searchHotels } from "../services/hotelService";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [searched, setSearched] = useState(false);
  const handleSearch = async (data) => {
    try {
      setLoading(true);
      const result = await searchHotels(data.city);
      setHotels(result);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Find Hotels
      </Typography>
      <SearchForm onSearch={handleSearch} />
      {loading && <CircularProgress />}
      {!loading && searched && hotels.length === 0 && (
        <Alert severity="info">No hotels found</Alert>
      )}
      {!loading && hotels.length > 0 && (
        <Box sx={{ width: "100%", mt: 3 }}>
          <HotelGrid hotels={hotels} />
        </Box>
      )}
    </Box>
  );
}
