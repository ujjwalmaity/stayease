import { Grid, Button } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import colors from "../../styles/colors";
import { validateDates } from "../../utils/dateValidation";

const FIELD_SX = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: colors.surface, height: 52 },
};

export default function AvailabilitySearch({ onSearch, initialCheckIn, initialCheckOut }) {
  const [checkInDate, setCheckInDate] = useState(initialCheckIn ? dayjs(initialCheckIn) : null);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut ? dayjs(initialCheckOut) : null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCheckInDate(initialCheckIn ? dayjs(initialCheckIn) : null);
    setCheckOutDate(initialCheckOut ? dayjs(initialCheckOut) : null);
  }, [initialCheckIn, initialCheckOut]);

  // Live validation — catches keyboard-typed past / reverse-order / same-day dates.
  const dateErrors = useMemo(
    () => validateDates(checkInDate, checkOutDate),
    [checkInDate, checkOutDate]
  );

  // Disable the button whenever either date is invalid.
  const searchDisabled = !!dateErrors.checkIn || !!dateErrors.checkOut;

  // Show value-based errors live, but only surface the empty "Required"
  // messages after a search attempt.
  const checkInError = checkInDate || submitted ? dateErrors.checkIn : "";
  const checkOutError = checkOutDate || submitted ? dateErrors.checkOut : "";

  const handleSearch = () => {
    setSubmitted(true);
    if (dateErrors.checkIn || dateErrors.checkOut) return;
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
          onChange={(v) => {
            setCheckInDate(v);
            // Clear check-out if it is no longer after the new check-in.
            if (checkOutDate && v && v.isValid() && !checkOutDate.isAfter(v)) setCheckOutDate(null);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!checkInError,
              helperText: checkInError,
              sx: FIELD_SX,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DatePicker
          label="Check-Out Date"
          format="DD/MM/YYYY"
          minDate={checkInDate ? checkInDate.add(1, "day") : dayjs().add(1, "day")}
          value={checkOutDate}
          onChange={setCheckOutDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!checkOutError,
              helperText: checkOutError,
              sx: FIELD_SX,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          fullWidth
          variant="contained"
          disabled={searchDisabled}
          startIcon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
          onClick={handleSearch}
          sx={{
            height: 52,
            borderRadius: "10px",
            fontWeight: 700,
            bgcolor: colors.accent,
            color: "#fff",
            "&:hover": { bgcolor: colors.accentDark },
            "&.Mui-disabled": { bgcolor: colors.outlineVariant, color: "#fff" },
            boxShadow: "none",
          }}
        >
          Check Availability
        </Button>
      </Grid>
    </Grid>
  );
}
