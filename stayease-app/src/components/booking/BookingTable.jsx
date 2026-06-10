import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";


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
            <TableCell>{dayjs(booking.checkInDate).format("DD-MM-YYYY")}</TableCell>
            <TableCell>{dayjs(booking.checkOutDate).format("DD-MM-YYYY")}</TableCell>
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
                sx={{
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    fontWeight: 600,
                    px: 2,
                    textTransform: "none",
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "#c62828",
                      boxShadow: 4,
                    },
                  }}
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
