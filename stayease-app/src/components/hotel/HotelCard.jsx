import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function HotelCard({ hotel, searchDates }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: 320,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardMedia component="img" height="220" image={hotel.coverImageUrl} />
      <CardContent>
        <Typography variant="h6">{hotel.name}</Typography>
        <Typography>{hotel.city}</Typography>
        <Chip label={`${hotel.starRating} Star`} sx={{ mt: 1 }} />
        <Typography sx={{ mt: 2 }}>Starting from</Typography>
        <Typography variant="h6" color="primary">
          ₹{hotel.startingPrice}/night
        </Typography>
        <Link
          to={`/hotels/${hotel.id}`}
          state={searchDates}
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 28,
              px: 2,
              mt: 2,
              textTransform: "none",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#1565c0",
                boxShadow: 4,
              },
            }}
          >
            View Rooms
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
