import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";


export default function BookingTable({ bookings, onCancel }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Reference</TableCell>
          <TableCell>Hotel</TableCell>
          <TableCell>Room</TableCell>
          <TableCell>Check In</TableCell>
          <TableCell>Check Out</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.bookingRef}</TableCell>
            <TableCell>{booking.hotelName}</TableCell>
            <TableCell>{booking.roomType}</TableCell>
            <TableCell>{booking.checkInDate}</TableCell>
            <TableCell>{booking.checkOutDate}</TableCell>
            <TableCell>₹{booking.totalPrice}</TableCell>
            <TableCell>
              <Chip
                color={booking.status === "CONFIRMED" ? "success" : "error"}
                label={booking.status}
              />
            </TableCell>
            <TableCell>
              {booking.status === "CONFIRMED" && (
                <Button
                  color="error"
                  onClick={() => onCancel(booking.id)}
                >
                  Cancel
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
