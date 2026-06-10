import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelDialog from "./HotelDialog";

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
          <TableCell sx={{ fontWeight: 600}}>Description</TableCell>
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
            <TableCell>{hotel.description}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => onEdit(hotel)}
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
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(hotel.id)}
                  sx={{
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 28,
                    px: 2,
                    textTransform: "none",
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "#c62828",
                      boxShadow: 4,
                    },
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
