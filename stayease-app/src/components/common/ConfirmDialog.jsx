import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { color } from "../../theme/tokens";

/**
 * ConfirmDialog — accessible replacement for window.confirm().
 * Keyboard-trappable, focus-managed, matches design system.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      aria-describedby="confirm-dialog-desc"
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <WarningAmberRoundedIcon sx={{ color: color.warning, fontSize: 24 }} />
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography id="confirm-dialog-desc" variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          autoFocus
          sx={{ flex: 1, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{ flex: 1, borderRadius: 2, boxShadow: "none" }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
