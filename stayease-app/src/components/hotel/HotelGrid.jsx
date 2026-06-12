import { Grid } from "@mui/material";
import HotelCard, { HotelCardSkeleton } from "./HotelCard";

export default function HotelGrid({ hotels, searchDates, loading = false }) {
  if (loading) {
    return (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <HotelCardSkeleton index={i} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {hotels.map((hotel, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={hotel.id}>
          <HotelCard hotel={hotel} searchDates={searchDates} index={i} />
        </Grid>
      ))}
    </Grid>
  );
}
