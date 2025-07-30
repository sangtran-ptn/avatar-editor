import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Box } from '@mui/material';

interface Props {
  imageSrc: string;
  aspect: number;
  onCropComplete: (croppedAreaPixels: any) => void;
}

const PhotoCropper: React.FC<Props> = ({ imageSrc, aspect, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    onCropComplete(croppedAreaPixels);
  }, [onCropComplete]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        cropShape="rect"
        showGrid={false}
      />
    </Box>
  );
};

export default PhotoCropper;
