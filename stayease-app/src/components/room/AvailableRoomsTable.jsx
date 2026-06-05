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
