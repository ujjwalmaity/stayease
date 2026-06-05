import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Alert,
} from "@mui/material";

export default function UpcomingBookings({ bookings }) {
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.checkInDate) >= new Date(),
  );

  if (upcomingBookings.length === 0) {
    return <Alert severity="info">No upcoming bookings found.</Alert>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Upcoming Reservations
        </Typography>
        <Chip label={`${upcomingBookings.length} Booking(s)`} color="primary" />
      </Box>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f5f7fa",
            }}
          >
            <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Guest</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Room</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Check-In</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Check-Out</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upcomingBookings.map((booking) => (
            <TableRow
              key={booking.bookingId}
              hover
              sx={{
                "&:hover": {
                  backgroundColor: "#fafafa",
                },
              }}
            >
              <TableCell>{booking.bookingRef}</TableCell>
              <TableCell>{booking.guestName}</TableCell>
              <TableCell>{booking.roomType}</TableCell>
              <TableCell>
                {new Date(booking.checkInDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip
                  label={booking.status}
                  color="success"
                  size="small"
                  sx={{
                    fontWeight: 600,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
