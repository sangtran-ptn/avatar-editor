import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import PhotoCropper from '../ReusablePhotoEditor/PhotoCropper';
import CropControls from '../ReusablePhotoEditor/CropControls';
import { usePhotoEditor } from '../../hooks/usePhotoEditor';

interface Props {
  open: boolean;
  initialPhoto: string | null;
  aspect: number;
  onClose: () => void;
  onSave: (croppedBlob: Blob | null) => void;
}

const PhotoEditDialog: React.FC<Props> = ({
  open, initialPhoto, aspect, onClose, onSave
}) => {
  const { photo, replace, remove, undo, hasChanged, setOriginal } = usePhotoEditor(initialPhoto);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = (croppedAreaPixels: any) => setCroppedArea(croppedAreaPixels);

  const handleSave = async () => {
    // convert to blob using canvas (bạn bổ sung logic)
    const blob = null; // thực tế: crop image từ croppedArea
    setOriginal(photo);
    onSave(blob);
  };

  const handleCancel = () => {
    undo();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Edit Photo</DialogTitle>
      <DialogContent>
        {photo ? (
          <>
            <PhotoCropper imageSrc={photo} aspect={aspect} onCropComplete={handleCropComplete} />
            <CropControls
              zoom={zoom}
              onZoomChange={setZoom}
              onReplace={() => {/* open picker */}}
              onUndo={undo}
              onRemove={remove}
              showUndo={hasChanged}
              showRemove={hasChanged}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </>
        ) : (
          <CropControls
            zoom={zoom}
            onZoomChange={setZoom}
            onReplace={() => {/* open picker */}}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoEditDialog;
