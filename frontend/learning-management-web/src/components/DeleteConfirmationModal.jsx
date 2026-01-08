import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function DeleteConfirmationModal({
  open,
  setOpen,
  title,
  message,
  onConfirm,
  loading,
  closeModal
}) {
  const handleClose = () =>{ 
    closeModal()
    setOpen(false)
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal()
    // handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {title || "Confirm Delete"}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Backdrop open={loading}>
          <CircularProgress color="#3B9261" /> 
        </Backdrop>
        <Typography variant="body1">
          {message || "Are you sure you want to delete this item?"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} className="cancelBtn">
          Cancel
        </Button>
        <Button onClick={handleConfirm} className="deleteBtn">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationModal;
