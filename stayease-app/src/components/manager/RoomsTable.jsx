import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Switch,
} from "@mui/material";

export default function RoomsTable({ rooms, onEdit, onDelete, onToggle }) {
  return (
    <Table>
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "#f5f7fa",
          }}
        >
          <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rooms.map((room) => (
          <TableRow
            key={room.id}
            hover
            sx={{
              "&:hover": {
                backgroundColor: "#fafafa",
              },
            }}
          >
            <TableCell>{room.roomNumber}</TableCell>
            <TableCell>{room.roomType}</TableCell>
            <TableCell>₹{room.pricePerNight}</TableCell>
            <TableCell>
              <Switch
                checked={room.isActive}
                onChange={() => onToggle(room.id)}
              />
            </TableCell>
            <TableCell>
              <Button onClick={() => onEdit(room)}>Edit</Button>
              <Button color="error" onClick={() => onDelete(room.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
