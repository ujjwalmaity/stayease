import { Button, Grid, TextField, Paper } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
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
    <Paper
      elevation={6}
      sx={{
        padding: "30px 24px 0px 24px",
        borderRadius: 4,
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        maxWidth: 1100,
        mx: "auto",
        mt: 1,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Destination"
            placeholder="Enter city"
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
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
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                },
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
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            sx={{
              height: "56px",
              borderRadius: 3,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
                // transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Search Hotels
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
