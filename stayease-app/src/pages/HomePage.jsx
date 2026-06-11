import { Alert, CircularProgress, Typography, Box } from "@mui/material";
import { useState } from "react";
import SearchForm from "../components/hotel/SearchForm";
import HotelGrid from "../components/hotel/HotelGrid";
import { searchHotels } from "../services/hotelService";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [searched, setSearched] = useState(false);
  // add state for dates
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // handleSearch receives { city, checkInDate, checkOutDate }
  const handleSearch = async (data) => {
    try {
      setLoading(true);
      setCheckInDate(data.checkInDate || "");
      setCheckOutDate(data.checkOutDate || "");
      const result = await searchHotels(data.city, data.checkInDate, data.checkOutDate);
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
      <Typography
        variant="h3"
        sx={{
          color: "#1976d2",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Find Your Perfect Stay
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "#1976d2",
          mb: 4,
        }}
      >
        Discover amazing hotels at unbeatable prices
      </Typography>
      <SearchForm onSearch={handleSearch} />
      {loading && <CircularProgress />}
      {!loading && searched && hotels.length === 0 && (
        <Alert severity="info">No hotels found</Alert>
      )}
      {!loading && hotels.length > 0 && (
        <Box sx={{ width: "100%", mt: 3 }}>
          <HotelGrid
            hotels={hotels}
            searchDates={{ checkInDate, checkOutDate }}
          />
        </Box>
      )}
    </Box>
  );
}
