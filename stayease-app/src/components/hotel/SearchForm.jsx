import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function SearchForm({ onSearch }) {
  const [city, setCity] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const [errors, setErrors] = useState({
    city: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const validate = () => {
    const newErrors = {
      city: "",
      checkInDate: "",
      checkOutDate: "",
    };

    let isValid = true;

    if (!city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
      isValid = false;
    }

    if (!checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSearch = () => {
    if (!validate()) return;

    onSearch({
      city: city.trim(),
      checkInDate: checkInDate?.format("YYYY-MM-DD") || "",
      checkOutDate: checkOutDate?.format("YYYY-MM-DD") || "",
    });
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="City"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);

            if (errors.city) {
              setErrors((prev) => ({
                ...prev,
                city: "",
              }));
            }
          }}
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <DatePicker
          label="Check-In Date"
          format="DD/MM/YYYY"
          minDate={dayjs()}
          value={checkInDate}
          onChange={(value) => {
            setCheckInDate(value);
            if (errors.checkInDate) {
              setErrors((prev) => ({
                ...prev,
                checkInDate: "",
              }));
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.checkInDate,
              helperText: errors.checkInDate,
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
          onChange={(value) => {
            setCheckOutDate(value);
            if (errors.checkOutDate) {
              setErrors((prev) => ({
                ...prev,
                checkOutDate: "",
              }));
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.checkOutDate,
              helperText: errors.checkOutDate,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          fullWidth
          variant="contained"
          sx={{ height: "56px" }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}