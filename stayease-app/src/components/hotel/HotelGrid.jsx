import { Grid } from "@mui/material";
import HotelCard from "./HotelCard";

export default function HotelGrid({ hotels, searchDates }) {
  return (
    <Grid container spacing={3} sx={{ ml: 10, justifyContent: "center" }}>
      {hotels.map((hotel) => (
        <Grid item xs={12} sm={6} md={4} key={hotel.id}>
          <HotelCard hotel={hotel} searchDates={searchDates} />
        </Grid>
      ))}
    </Grid>
  );
}
