// File: components/AddCropPhotoDialog/CropperArea.tsx
import React from 'react';
import Cropper from 'react-easy-crop';

interface CropperAreaProps {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  cropShape: 'round' | 'rect';
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
}

const CropperArea: React.FC<CropperAreaProps> = ({
  image,
  crop,
  zoom,
  aspect,
  cropShape,
  onCropChange,
  onZoomChange,
  onCropComplete,
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: 500 }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        cropShape={cropShape}
        showGrid={false}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
        objectFit="contain"
      />
    </div>
  );
};

export default CropperArea;
