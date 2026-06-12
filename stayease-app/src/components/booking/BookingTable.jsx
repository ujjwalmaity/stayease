import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, Chip, TableContainer, Typography, Box,
} from "@mui/material";
import dayjs from "dayjs";
import colors from "../../styles/colors";

const statusChipSx = (status) =>
  status === "CONFIRMED"
    ? { bgcolor: colors.successLight, color: colors.success, fontWeight: 700 }
    : { bgcolor: colors.errorLight,   color: colors.error,   fontWeight: 700 };

export default function BookingTable({ bookings, onCancel }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {["Reference", "Hotel", "Room", "Check-In", "Check-Out", "Total", "Status", "Action"].map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    bgcolor: colors.accentContainer,
                    color: colors.accent,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    display: "inline-block",
                  }}
                >
                  {b.bookingRef}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{b.hotelName}</TableCell>
              <TableCell>
                <Chip label={b.roomType} size="small" sx={{ bgcolor: colors.surfaceContainerLow, fontWeight: 500 }} />
              </TableCell>
              <TableCell>{dayjs(b.checkInDate).format("DD MMM YYYY")}</TableCell>
              <TableCell>{dayjs(b.checkOutDate).format("DD MMM YYYY")}</TableCell>
              <TableCell>
                <Typography fontWeight={700} sx={{ color: colors.accent }}>
                  ₹{Number(b.totalPrice).toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={b.status} size="small" sx={statusChipSx(b.status)} />
              </TableCell>
              <TableCell>
                {b.status === "CONFIRMED" && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onCancel(b.id)}
                    sx={{ borderRadius: 8, fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
