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
    const [containerWidth, setContainerWidth] = useState(0);
    const [minZoom, setMinZoom] = useState(1);

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setContainerWidth(rect.width);
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const cropSize = {
        width: containerWidth - 30, // 15px left + 15px right
        height: containerWidth - 30,
    };

    useEffect(() => {
        if (!image || !cropSize.width || !cropSize.height) return;

        const img = new Image();
        img.onload = () => {
            console.log("cropSize", cropSize);
            console.log("img", img.width, img.height);
            const zoomX = cropSize.width / img.width;
            const zoomY = cropSize.height / img.height;
            const initialZoom = Math.max(zoomX, zoomY, 1);
            setMinZoom(initialZoom);
            
            console.log("initialZoom", initialZoom);
            onZoomChange(initialZoom);
        };
        img.src = image;
    }, [image, cropSize, onZoomChange]);

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
                    minZoom={minZoom}
                    aspect={1}
                    cropShape={cropShape}
                    showGrid={false}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropComplete}
                    cropSize={cropSize}
                    objectFit="contain"
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '0 20px',
                        // background: 'rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <Slider
                        min={minZoom}
                        max={10}
                        step={0.1}
                        value={zoom}
                        onChange={(_, value) => onZoomChange(value as number)}
                    // sx={{ color: 'white' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CropperArea;
