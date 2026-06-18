import { Grid, Button, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import colors from "../../styles/colors";

const FIELD_SX = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: colors.surface, height: 52 },
};

export default function AvailabilitySearch({ onSearch, initialCheckIn, initialCheckOut }) {
  const [checkInDate, setCheckInDate] = useState(initialCheckIn ? dayjs(initialCheckIn) : null);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut ? dayjs(initialCheckOut) : null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCheckInDate(initialCheckIn ? dayjs(initialCheckIn) : null);
    setCheckOutDate(initialCheckOut ? dayjs(initialCheckOut) : null);
  }, [initialCheckIn, initialCheckOut]);

  const handleSearch = () => {
    setError("");
    if (!checkInDate) { setError("Please select a check-in date"); return; }
    if (!checkOutDate) { setError("Please select a check-out date"); return; }
    if (checkOutDate.isSame(checkInDate)) { setError("Check-out must be after check-in"); return; }
    onSearch(checkInDate.format("YYYY-MM-DD"), checkOutDate.format("YYYY-MM-DD"));
  };

  return (
    <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
      <Grid item xs={12} md={4}>
        <DatePicker
          label="Check-In Date"
          format="DD/MM/YYYY"
          minDate={dayjs()}
          value={checkInDate}
          onChange={setCheckInDate}
          slotProps={{ textField: { fullWidth: true, sx: FIELD_SX } }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DatePicker
          label="Check-Out Date"
          format="DD/MM/YYYY"
          minDate={checkInDate || dayjs()}
          value={checkOutDate}
          onChange={setCheckOutDate}
          slotProps={{ textField: { fullWidth: true, sx: FIELD_SX } }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          onClick={handleSearch}
          sx={{
            height: 52,
            borderRadius: "10px",
            fontWeight: 700,
            bgcolor: colors.accent,
            color: "#fff",
            "&:hover": { bgcolor: colors.accentDark },
            boxShadow: "none",
          }}
        >
          Check Availability
        </Button>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        </Grid>
      )}
    </Grid>
  );
}
