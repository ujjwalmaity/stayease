import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";

export default function HotelsTable({ hotels, onEdit, onDelete }) {
  return (
    <Table>
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "#f5f7fa",
          }}
        >
          <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Stars</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {hotels.map((hotel) => (
          <TableRow
            key={hotel.id}
            hover
            sx={{
              "&:hover": {
                backgroundColor: "#fafafa",
              },
            }}
          >
            <TableCell>{hotel.name}</TableCell>
            <TableCell>{hotel.city}</TableCell>
            <TableCell>{hotel.starRating}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(hotel)}>Edit</Button>
              <Button color="error" onClick={() => onDelete(hotel.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
