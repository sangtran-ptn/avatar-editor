import Cropper, { Area } from 'react-easy-crop';
import { useCallback, useEffect, useState } from 'react';
import { Box, Slider } from '@mui/material';
import { getCroppedImg } from './utils';

type Props = {
  image: string;
  onImageCropped: (blob: Blob) => void;
};

const CropperArea = ({ image, onImageCropped }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const cropSize = {
    width: Math.min(window.innerWidth - 30, 300),
    height: Math.min(window.innerWidth - 30, 300),
  };

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const generateCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImg(image, croppedAreaPixels);
    onImageCropped(blob);
  }, [croppedAreaPixels, image]);

  useEffect(() => {
    generateCroppedImage(); // trigger cropping on mount or zoom/crop updates
  }, [generateCroppedImage]);

  return (
    <Box sx={{ position: 'relative', height: '60vh' }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        cropSize={cropSize}
        aspect={1}
        cropShape="round"
        objectFit="horizontal-cover"
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        restrictPosition
      />
      <Box sx={{ px: 2, pt: 2 }}>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={(_, z) => setZoom(z as number)}
        />
      </Box>
    </Box>
  );
};

export default CropperArea;
