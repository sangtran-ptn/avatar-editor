import React from 'react';
import { Box, Button, Slider, Stack, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';

interface CropControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onReplace: () => void;
  onUndo?: () => void;
  onRemove?: () => void;
  onSave: () => void;
  onCancel: () => void;
  showUndo?: boolean;
  showRemove?: boolean;
}

const CropControls: React.FC<CropControlsProps> = ({
  zoom, onZoomChange, onReplace, onUndo, onRemove,
  onSave, onCancel, showUndo = false, showRemove = false,
}) => (
  <Box sx={{ px: 2, py: 3 }}>
    <Typography variant="subtitle2" gutterBottom>Zoom</Typography>
    <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, v) => onZoomChange(v as number)} />
    <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
      <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={onReplace}>Replace Photo</Button>
      {showUndo && onUndo && <Button variant="outlined" startIcon={<UndoIcon />} onClick={onUndo}>Undo</Button>}
      {showRemove && onRemove && <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={onRemove}>Remove Photo</Button>}
    </Stack>
    <Stack direction="row" spacing={2} mt={3}>
      <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      <Button variant="contained" onClick={onSave}>Save</Button>
    </Stack>
  </Box>
);

export default CropControls;
