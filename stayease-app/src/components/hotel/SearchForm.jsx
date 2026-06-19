import { Button, Box, Paper, Autocomplete, TextField, CircularProgress } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useCallback, useRef, useMemo } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import colors from "../../styles/colors";
import { validateDates } from "../../utils/dateValidation";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#fff",
    borderRadius: "12px",
    fontSize: "0.9375rem",
    "& fieldset": { borderColor: colors.outlineVariant },
    "&:hover fieldset": { borderColor: colors.onSurfaceVariant },
    "&.Mui-focused fieldset": { borderColor: colors.accent, borderWidth: "2px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: colors.accent },
};

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

export default function SearchForm({ onSearch }) {
  const [city, setCity] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [errors, setErrors] = useState({ city: "", checkIn: "", checkOut: "" });
  const debounceRef = useRef(null);

  // Live date validation — recomputed on every change so keyboard-typed
  // invalid dates (past / reverse-order / same-day) are caught immediately.
  const dateErrors = useMemo(
    () => validateDates(checkInDate, checkOutDate),
    [checkInDate, checkOutDate]
  );

  // Disable Search when the city is empty or either date is invalid.
  const searchDisabled = !city.trim() || !!dateErrors.checkIn || !!dateErrors.checkOut;

  // Show value-based errors (past / reverse-order / same-day) live, but only
  // surface the empty "Required" message after a submit attempt.
  const checkInError = errors.checkIn || (checkInDate ? dateErrors.checkIn : "");
  const checkOutError = errors.checkOut || (checkOutDate ? dateErrors.checkOut : "");

  const fetchCities = useCallback((query) => {
    if (!query || query.length < 2) { setCityOptions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setCityLoading(true);
      try {
        const res = await fetch(
          `${NOMINATIM_BASE}?q=${encodeURIComponent(query)}&addressdetails=1&limit=10&format=json&countrycodes=in`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const seen = new Set();
        const cities = [];
        for (const d of data) {
          const name =
            d.address?.city ||
            d.address?.town ||
            d.address?.village ||
            d.address?.municipality ||
            d.address?.county ||
            d.address?.state_district ||
            d.address?.state;
          if (name && !seen.has(name)) {
            seen.add(name);
            cities.push(name);
          }
        }
        setCityOptions(cities.slice(0, 8));
      } catch {
        setCityOptions([]);
      } finally {
        setCityLoading(false);
      }
    }, 400);
  }, []);

  const validate = () => {
    const dateErrs = validateDates(checkInDate, checkOutDate);
    const e = { city: "", checkIn: dateErrs.checkIn, checkOut: dateErrs.checkOut };
    let ok = !dateErrs.checkIn && !dateErrs.checkOut;
    if (!city.trim()) { e.city = "City is required"; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSearch = () => {
    if (!validate()) return;
    onSearch({
      city: city.trim(),
      checkInDate: checkInDate.format("YYYY-MM-DD"),
      checkOutDate: checkOutDate.format("YYYY-MM-DD"),
    });
  };

  return (
    <Paper
      component="form"
      role="search"
      aria-label="Search for hotels"
      elevation={0}
      onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
      sx={{
        borderRadius: "16px",
        bgcolor: "#fff",
        boxShadow: "0 8px 40px rgba(0,0,0,0.20)",
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, md: 2 },
        border: `1px solid ${colors.outlineVariant}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 1.5 },
          alignItems: "flex-start",
        }}
      >
        {/* ── City Autocomplete ── */}
        <Box sx={{ flex: { md: "2 1 0" }, minWidth: 0, width: "100%" }}>
          <Autocomplete
            freeSolo
            options={cityOptions}
            loading={cityLoading}
            inputValue={city}
            onInputChange={(_, val, reason) => {
              setCity(val);
              if (reason === "input") fetchCities(val);
              if (errors.city) setErrors((p) => ({ ...p, city: "" }));
            }}
            onChange={(_, val) => {
              if (val) {
                setCity(val);
                if (errors.city) setErrors((p) => ({ ...p, city: "" }));
              }
            }}
            filterOptions={(x) => x}
            noOptionsText={city.length < 2 ? "Type at least 2 characters…" : "No cities found"}
            loadingText="Searching cities…"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                placeholder="City, e.g. Mumbai"
                error={!!errors.city}
                helperText={errors.city}
                sx={fieldSx}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon
                        sx={{ color: errors.city ? colors.error : colors.accent, fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {cityLoading && <CircularProgress size={16} sx={{ color: colors.accent }} />}
                      {params.InputProps?.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* ── Check-In ── */}
        <Box sx={{ flex: { md: "1 1 0" }, minWidth: 0, width: "100%" }}>
          <DatePicker
            label="Check-In"
            format="DD MMM YYYY"
            minDate={dayjs()}
            value={checkInDate}
            onChange={(v) => {
              setCheckInDate(v);
              if (checkOutDate && v && v.isValid() && !checkOutDate.isAfter(v)) setCheckOutDate(null);
              if (errors.checkIn) setErrors((p) => ({ ...p, checkIn: "" }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!checkInError,
                helperText: checkInError,
                sx: fieldSx,
              },
            }}
          />
        </Box>

        {/* ── Check-Out ── */}
        <Box sx={{ flex: { md: "1 1 0" }, minWidth: 0, width: "100%" }}>          <DatePicker
            label="Check-Out"
            format="DD MMM YYYY"
            minDate={checkInDate ? checkInDate.add(1, "day") : dayjs().add(1, "day")}
            value={checkOutDate}
            onChange={(v) => {
              setCheckOutDate(v);
              if (errors.checkOut) setErrors((p) => ({ ...p, checkOut: "" }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!checkOutError,
                helperText: checkOutError,
                sx: fieldSx,
              },
            }}
          />
        </Box>

        {/* ── Search Button ── */}
        <Box sx={{ flex: { md: "0 0 auto" }, width: { xs: "100%", md: "auto" } }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            onClick={handleSearch}
            disabled={searchDisabled}
            startIcon={<SearchIcon />}
            fullWidth
            sx={{
              height: 56,
              px: 3.5,
              borderRadius: "12px",
              bgcolor: colors.accent,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9375rem",
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": { bgcolor: colors.accentDark, boxShadow: "none", transform: "none" },
              "&.Mui-disabled": { bgcolor: colors.outlineVariant, color: "#fff" },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
