import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Box, Slider } from '@mui/material';
import getCroppedImg from '../../utils/cropImage';

type Props = {
  imageSrc: string;
  onCropComplete: (dataUrl: string) => void;
};

export default function CropperCanvas({ imageSrc, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateCroppedImage = useCallback(async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
  }, [imageSrc, croppedAreaPixels]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pt: '100%', // square crop zone
        background: '#000',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 35,
          left: 15,
          right: 15,
          bottom: 35,
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          onInteractionEnd={generateCroppedImage}
          minZoom={1}
        />
      </Box>
      <Box sx={{ px: 2, mt: 2 }}>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={(_, value) => setZoom(value as number)}
        />
      </Box>
    </Box>
  );
}
