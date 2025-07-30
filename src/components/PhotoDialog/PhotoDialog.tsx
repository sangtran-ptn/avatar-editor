import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
} from '@mui/material';
import CropperArea from './CropperArea';
import PhotoActions from './PhotoActions';
import AvatarFallback from './AvatarFallback';
import { useState } from 'react';

type Props = {
  open: boolean;
  imageUrl?: string;
  defaultAvatarText?: string;
  onClose: () => void;
  onSave: (image: Blob, hasChanged: boolean) => void;
};

const PhotoDialog = ({ open, imageUrl, defaultAvatarText, onClose, onSave }: Props) => {
  const [imageSrc, setImageSrc] = useState<string | null>(imageUrl || null);
  const [hasChanged, setHasChanged] = useState(false);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const handleSave = () => {
    if (croppedImage) onSave(croppedImage, hasChanged);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Photo</DialogTitle>
      <DialogContent>
        {imageSrc ? (
          <CropperArea
            image={imageSrc}
            onImageCropped={(blob) => {
              setCroppedImage(blob);
              setHasChanged(true);
            }}
          />
        ) : (
          <AvatarFallback text={defaultAvatarText || 'User'} />
        )}
        <PhotoActions
          onImageSelected={(src) => {
            setImageSrc(src);
            setHasChanged(true);
          }}
          onRemovePhoto={() => {
            setImageSrc(null);
            setHasChanged(true);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!hasChanged}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoDialog;
