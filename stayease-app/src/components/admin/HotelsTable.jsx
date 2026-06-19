import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Button, Stack, TableContainer, Typography, Box, Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import StarIcon from "@mui/icons-material/Star";
import colors from "../../styles/colors";
import TableSkeletonBody from "../common/TableSkeletonBody";

const SKELETON_COLUMNS = [
  { width: "70%" },                                   // Name
  { variant: "rounded", width: 80 },                  // City
  { width: 80 },                                      // Stars
  { width: "85%" },                                   // Description
  { variant: "rounded", width: 150 },                 // Actions
];

export default function HotelsTable({ hotels, onEdit, onDelete, loading = false, skeletonRows = 5 }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {["Name", "City", "Stars", "Description", "Actions"].map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {loading ? (
          <TableSkeletonBody columns={SKELETON_COLUMNS} rows={skeletonRows} />
        ) : (
        <TableBody>
          {hotels.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell sx={{ fontWeight: 700 }}>{hotel.name}</TableCell>
              <TableCell>
                <Chip
                  label={hotel.city}
                  size="small"
                  sx={{ bgcolor: colors.accentContainer, color: colors.accent, fontWeight: 500 }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                    <StarIcon key={i} sx={{ fontSize: 14, color: colors.accent }} />
                  ))}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({hotel.starRating})
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: colors.onSurfaceVariant,
                  fontSize: "0.875rem",
                }}
              >
                {hotel.description}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditOutlinedIcon fontSize="small" />}
                    onClick={() => onEdit(hotel)}
                    sx={{ borderRadius: 8, fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteOutlineIcon fontSize="small" />}
                    onClick={() => onDelete(hotel.id)}
                    sx={{ borderRadius: 8, fontWeight: 600, fontSize: "0.8125rem" }}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
