import { TableBody, TableRow, TableCell, Skeleton } from "@mui/material";

/**
 * Renders placeholder skeleton rows for a table body.
 *
 * Host tables keep their own <TableHead>, so when real data swaps in the header
 * stays pixel-identical — giving a seamless (non-flickering) transition instead
 * of a spinner that pops the whole layout in at once.
 *
 * @param {Array<{align?: "left"|"right"|"center", width?: number|string, variant?: "text"|"rounded"}>} columns
 *        One descriptor per column. Mirror the real cell so the placeholder reads
 *        like the content it stands in for (chips → "rounded", text → "text").
 * @param {number} [rows=5] Number of placeholder rows to render.
 */
export default function TableSkeletonBody({ columns, rows = 5 }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={r}>
          {columns.map((col, c) => (
            <TableCell key={c} align={col.align}>
              <Skeleton
                variant={col.variant || "text"}
                width={col.width || "100%"}
                height={col.variant === "rounded" ? 28 : 22}
                sx={col.align === "right" ? { ml: "auto" } : undefined}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
