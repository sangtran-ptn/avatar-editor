// File: components/AddCropPhotoDialog/AddCropPhotoDialog.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Stack,
  Slider,
  Typography,
  IconButton
} from '@mui/material';
import { PhotoCamera, Delete, Image } from '@mui/icons-material';
import CropperArea from './CropperArea';
import AvatarFallback from './AvatarFallback';
import getCroppedImg from './utils';

interface AddCropPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (croppedFile: File | null, hasChanged: boolean) => void;
  imageUrl?: string;
  placeholderText?: string;
  isAvatar?: boolean;
}

const AddCropPhotoDialog: React.FC<AddCropPhotoDialogProps> = ({
  open,
  onClose,
  onSave,
  imageUrl,
  placeholderText,
  isAvatar = true,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(imageUrl || null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasChanged, setHasChanged] = useState(false);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSelectPhoto = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    setHasChanged(true);
  };

  const handleUseCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = handleFileChange as any;
    input.click();
  };

  const handleRemovePhoto = () => {
    setImageSrc(null);
    setHasChanged(true);
  };

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedFile, hasChanged);
    } else {
      onSave(null, hasChanged);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        {imageSrc ? (
          <CropperArea
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={isAvatar ? 1 : 16 / 9}
            cropShape={isAvatar ? 'round' : 'rect'}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        ) : (
          <AvatarFallback text={placeholderText} />
        )}

        {/* <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(_, value) => setZoom(value as number)}
          sx={{ mt: 2 }}
        /> */}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button startIcon={<Image />} onClick={handleSelectPhoto}>Select Photo</Button>
          <Button startIcon={<PhotoCamera />} onClick={handleUseCamera}>Use Camera</Button>
          {imageUrl && (
            <Button startIcon={<Delete />} onClick={handleRemovePhoto}>Remove Photo</Button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCropPhotoDialog;
