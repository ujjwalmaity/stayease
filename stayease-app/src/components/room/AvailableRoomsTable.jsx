import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

export default function AvailableRoomsTable({ rooms, onBook }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Room Type</TableCell>
          <TableCell>Price/Night</TableCell>
          <TableCell>Max Occupancy</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rooms.map((room) => (
          <TableRow key={room.id}>
            <TableCell>{room.roomType}</TableCell>
            <TableCell>₹{room.pricePerNight}</TableCell>
            <TableCell>{room.maxOccupancy}</TableCell>
            <TableCell>{room.description}</TableCell>
            <TableCell>
              <Button
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 28,
                  px: 2,
                  textTransform: "none",
                  boxShadow: 2,
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    boxShadow: 4,
                  },
                }}
                variant="contained"
                size="small"
                onClick={() => onBook(room)}
              >
                Book
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
