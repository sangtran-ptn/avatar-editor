// File: components/AddCropPhotoDialog/CropperArea.tsx
import React, { useRef, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@mui/material';

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
    const containerRef = useRef<HTMLDivElement>(null);
    const [cropSize, setCropSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {

            // console.log('containerRef width:', containerRef.current?.off);
            // console.log('containerRef height:', containerRef.current?.offsetHeight);

            const screenWidth = 600; // window.innerWidth;
            const screenHeight = 600; // window.innerHeight;

            // Desired padding from crop to container edges
            const paddingX = 15 * 2;
            const paddingY = 35 * 2;

            const maxCropWidth = screenWidth - paddingX;
            const maxCropHeight = screenHeight - paddingY;

            const cropDiameter = Math.min(maxCropWidth, maxCropHeight);
            setCropSize({ width: cropDiameter, height: cropDiameter });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: cropSize.width + 30,
                    height: cropSize.height + 70,
                }}
            >
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape={cropShape}
                    showGrid={false}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropComplete}
                    cropSize={cropSize}
                    objectFit="horizontal-cover"
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px' }}>
                    <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(_, value) => onZoomChange(value as number)}
                    // sx={{ mx: 2 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CropperArea;