import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Button, Chip, TableContainer, Typography, Box,
} from "@mui/material";
import KingBedIcon from "@mui/icons-material/KingBed";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import colors from "../../styles/colors";

const ROOM_TYPE_COLOR = {
  SINGLE: { bg: colors.accentContainer, color: colors.accent },
  DOUBLE: { bg: colors.secondaryContainer, color: colors.secondaryDark },
  SUITE:  { bg: "#FFF8E1", color: "#E65100" },
};

export default function AvailableRoomsTable({ rooms, onBook, canBook = true }) {
  return (
    <TableContainer sx={{ borderRadius: 3, border: `1px solid ${colors.outlineVariant}`, overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room Type</TableCell>
            <TableCell>Price / Night</TableCell>
            <TableCell>Max Guests</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => {
            const typeStyle = ROOM_TYPE_COLOR[room.roomType] || ROOM_TYPE_COLOR.SINGLE;
            return (
              <TableRow key={room.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <KingBedIcon sx={{ fontSize: 18, color: typeStyle.color }} />
                    <Chip
                      label={room.roomType}
                      size="small"
                      sx={{ bgcolor: typeStyle.bg, color: typeStyle.color, fontWeight: 600, fontSize: "0.8rem" }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 700, color: colors.accent, fontSize: "1rem" }}>
                    ₹{Number(room.pricePerNight).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">per night</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <PeopleAltOutlinedIcon sx={{ fontSize: 16, color: colors.onSurfaceVariant }} />
                    <Typography variant="body2" fontWeight={500}>{room.maxOccupancy}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 240 }}>
                    {room.description}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!canBook}
                    onClick={() => onBook(room)}
                    sx={{
                      borderRadius: 8,
                      fontWeight: 700,
                      px: 2.5,
                      bgcolor: canBook ? colors.accent : undefined,
                      color: canBook ? "#fff" : undefined,
                      boxShadow: "none",
                    }}
                  >
                    Book Now
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
