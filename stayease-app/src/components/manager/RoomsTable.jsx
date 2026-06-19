import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Stack, Chip, TableContainer, Typography, Box,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import colors from "../../styles/colors";
import TableSkeletonBody from "../common/TableSkeletonBody";

const TYPE_STYLE = {
  SINGLE: { bg: colors.accentContainer,    color: colors.accent },
  DOUBLE: { bg: colors.secondaryContainer, color: colors.secondaryDark },
  SUITE:  { bg: "#FFF8E1",                 color: "#E65100" },
};

const SKELETON_COLUMNS = [
  { width: "65%" },                    // Hotel
  { width: 60 },                       // Room No.
  { variant: "rounded", width: 70 },   // Type
  { width: 70 },                       // Price / Night
  { variant: "rounded", width: 70 },   // Status
  { align: "right", variant: "rounded", width: 150 }, // Actions
];

export default function RoomsTable({ rooms, onEdit, onDelete, loading = false, skeletonRows = 5 }) {
  if (!loading && rooms.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6, color: colors.onSurfaceMuted }}>
        <Typography variant="body1">No rooms added yet. Click "Add Room" to get started.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hotel</TableCell>
            <TableCell>Room No.</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Price / Night</TableCell>
            <TableCell>Status</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {loading ? (
          <TableSkeletonBody columns={SKELETON_COLUMNS} rows={skeletonRows} />
        ) : (
        <TableBody>
          {rooms.map((room) => {
            const ts = TYPE_STYLE[room.roomType] || TYPE_STYLE.SINGLE;
            return (
              <TableRow key={room.id}>
                <TableCell sx={{ color: colors.onSurfaceVariant, fontSize: "0.875rem" }}>
                  {room.hotelName ?? "—"}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.onBackground }}>{room.roomNumber}</TableCell>
                <TableCell>
                  <Chip label={room.roomType} size="small" sx={{ bgcolor: ts.bg, color: ts.color, fontWeight: 600 }} />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={700} sx={{ color: colors.accent }}>
                    ₹{Number(room.pricePerNight).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={room.isActive ? "Active" : "Inactive"}
                    size="small"
                    sx={room.isActive
                      ? { bgcolor: colors.successLight, color: colors.success, fontWeight: 600 }
                      : { bgcolor: colors.surfaceContainerHigh, color: colors.onSurfaceVariant, fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditOutlinedIcon fontSize="small" />}
                      onClick={() => onEdit(room)}
                      sx={{ borderRadius: 8, fontWeight: 600, fontSize: "0.8125rem" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteOutlineIcon fontSize="small" />}
                      onClick={() => onDelete(room.id)}
                      sx={{ borderRadius: 8, fontWeight: 600, fontSize: "0.8125rem" }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
