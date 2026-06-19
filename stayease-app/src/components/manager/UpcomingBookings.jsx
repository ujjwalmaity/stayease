import {
  Box, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, Alert, TableContainer, Skeleton,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import dayjs from "dayjs";
import colors from "../../styles/colors";
import TableSkeletonBody from "../common/TableSkeletonBody";

const SKELETON_COLUMNS = [
  { variant: "rounded", width: 90 },  // Reference
  { width: "70%" },                   // Guest
  { variant: "rounded", width: 70 },  // Room
  { width: 90 },                      // Check-In
  { width: 90 },                      // Check-Out
  { variant: "rounded", width: 80 },  // Status
];

export default function UpcomingBookings({ bookings = [], loading = false, skeletonRows = 4 }) {
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkInDate) >= new Date()
  );

  if (!loading && upcomingBookings.length === 0) {
    return <Alert severity="info" sx={{ borderRadius: 2 }}>No upcoming bookings found.</Alert>;
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventAvailableIcon sx={{ color: colors.accent, fontSize: 20 }} />
          <Typography variant="h6" fontWeight={700}>Upcoming Reservations</Typography>
        </Box>
        {loading ? (
          <Skeleton variant="rounded" width={96} height={32} />
        ) : (
          <Chip
            label={`${upcomingBookings.length} Booking${upcomingBookings.length > 1 ? "s" : ""}`}
            sx={{ bgcolor: colors.accentContainer, color: colors.accent, fontWeight: 700 }}
          />
        )}
      </Box>

      <TableContainer sx={{ borderRadius: 2, border: `1px solid ${colors.outlineVariant}` }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Reference", "Guest", "Room", "Check-In", "Check-Out", "Status"].map((h) => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeletonBody columns={SKELETON_COLUMNS} rows={skeletonRows} />
          ) : (
          <TableBody>
            {upcomingBookings.map((b) => (
              <TableRow key={b.bookingId ?? b.id}>
                <TableCell>
                  <Typography sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8125rem", color: colors.accent }}>
                    {b.bookingRef}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{b.guestName ?? b.userName}</TableCell>
                <TableCell>
                  <Chip label={b.roomType} size="small" sx={{ bgcolor: colors.surfaceContainerLow, fontWeight: 500 }} />
                </TableCell>
                <TableCell>{dayjs(b.checkInDate).format("DD MMM YYYY")}</TableCell>
                <TableCell>{dayjs(b.checkOutDate).format("DD MMM YYYY")}</TableCell>
                <TableCell>
                  <Chip
                    label={b.status}
                    size="small"
                    sx={{ bgcolor: colors.successLight, color: colors.success, fontWeight: 700 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  );
}
