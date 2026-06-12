import { Typography, Box, Stack, Chip } from "@mui/material";
import { useRef, useState, useMemo } from "react";
import SearchForm from "../components/hotel/SearchForm";
import HotelGrid from "../components/hotel/HotelGrid";
import { searchHotels } from "../services/hotelService";
import { toast } from "sonner";
import colors from "../styles/colors";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const TRUST_BADGES = [
  { icon: <VerifiedIcon sx={{ fontSize: 16 }} />, label: "Best Price Guarantee" },
  { icon: <SupportAgentIcon sx={{ fontSize: 16 }} />, label: "24/7 Support" },
  { icon: <TrendingDownIcon sx={{ fontSize: 16 }} />, label: "No Booking Fees" },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const resultsRef = useRef(null);
  const searchDates = useMemo(() => ({ checkInDate, checkOutDate }), [checkInDate, checkOutDate]);

  const handleSearch = async (data) => {
    try {
      setLoading(true);
      setSearchCity(data.city || "");
      setCheckInDate(data.checkInDate || "");
      setCheckOutDate(data.checkOutDate || "");
      const result = await searchHotels(data.city, data.checkInDate, data.checkOutDate);
      setHotels(result);
      setSearched(true);
      if (result.length === 0) {
        toast.info(`No hotels found in ${data.city} for the selected dates. Try a different city or dates.`);
      } else {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

      {/* ── Hero — full-bleed, escapes layout px padding ─── */}
      <Box
        sx={{
          // Escape the layout's horizontal padding so image fills edge-to-edge
          mx: { xs: -2, sm: -3, md: -4 },
          // Exact viewport height minus navbar — no overflow
          height: { xs: "calc(100vh - 64px)", md: "calc(100vh - 72px)", lg: "calc(100vh - 72px)" },
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Only show bottom margin when results exist below
          mb: searched && hotels.length > 0 ? { xs: 3, md: 4 } : 0,
        }}
      >
        {/* Background image */}
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Gradient overlay */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            px: { xs: 3, sm: 4, md: 6 },
            width: "100%",
            maxWidth: 960,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.875rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              mb: 1.5,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            Find Your Perfect Stay
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.9375rem", md: "1.0625rem" },
              color: "rgba(255,255,255,0.88)",
              mb: { xs: 2.5, md: 3 },
              fontWeight: 400,
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            Hundreds of hotels across India — best prices, instant booking
          </Typography>

          {/* Trust badges */}
          <Stack
            direction="row"
            sx={{ mb: { xs: 3, md: 4 }, flexWrap: "wrap", gap: 1, alignItems: "center", justifyContent: "center" }}
          >
            {TRUST_BADGES.map((b) => (
              <Chip
                key={b.label}
                icon={b.icon}
                label={b.label}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  backdropFilter: "blur(8px)",
                  "& .MuiChip-icon": { color: "rgba(255,255,255,0.85)" },
                }}
              />
            ))}
          </Stack>

          <SearchForm onSearch={handleSearch} />
        </Box>
      </Box>

      {/* ── Results ──────────────────────────────────────── */}
      <Box ref={resultsRef} sx={{ scrollMarginTop: 80 }}>
        {loading && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 3, pb: 2, borderBottom: `1px solid ${colors.outlineVariant}` }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Searching hotels in {searchCity}…</Typography>
            </Box>
            <HotelGrid loading />
          </Box>
        )}

        {!loading && hotels.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${colors.outlineVariant}`,
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: colors.onBackground }}>
                  {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} in {searchCity}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {checkInDate} → {checkOutDate}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Sorted by relevance
              </Typography>
            </Box>
            <HotelGrid hotels={hotels} searchDates={searchDates} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
