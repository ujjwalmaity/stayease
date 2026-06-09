import { Grid, Button, Alert } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function AvailabilitySearch({ onSearch }) {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [error, setError] = useState("");
  const handleSearch = () => {
    setError("");

    if (!checkInDate) {
      setError("Please select a check-in date");

      return;
    }

    if (!checkOutDate) {
      setError("Please select a check-out date");

      return;
    }

    if (checkOutDate.isSame(checkInDate)) {
      setError("Check-out date must be after check-in date");

      return;
    }

    onSearch(
      checkInDate.format("YYYY-MM-DD"),
      checkOutDate.format("YYYY-MM-DD"),
    );
  };
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <DatePicker
          label="Check-In Date"
          format="DD/MM/YYYY"
          minDate={dayjs()}
          value={checkInDate}
          onChange={setCheckInDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <DatePicker
          label="Check-Out Date"
          format="DD/MM/YYYY"
          minDate={checkInDate || dayjs()}
          value={checkOutDate}
          onChange={setCheckOutDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          sx={{ p: 2 }}
          fullWidth
          variant="contained"
          onClick={handleSearch}
        >
          Check Availability
        </Button>
      </Grid>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Grid>
  );
}
