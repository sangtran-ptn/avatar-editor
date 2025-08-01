import React, { useRef, useEffect, useState, useCallback } from 'react';
import Cropper, { MediaSize } from 'react-easy-crop';
import { Box, Slider } from '@mui/material';

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
    let [imageRef, setImageRef] = useState<React.RefObject<HTMLImageElement> | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [minZoom, setMinZoom] = useState(1);
    const [mediaSize, setMediaSize] = useState<MediaSize | null>(null);

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setContainerWidth(rect.width);
            console.log("Container width:", rect.width);
            console.log("Container height:", rect.height);
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const cropSize = {
        width: containerWidth - 70, // 15px left + 15px right
        height: containerWidth - 70,
    };

    const handleMediaLoaded = useCallback((size: MediaSize) => {
        setMediaSize(size);
        console.log("Media size loaded:", size, imageRef, mediaSize);

        if (!containerRef.current) return;

        const height = containerRef.current.getBoundingClientRect().width - 70;

        const zoomX = height / size.width;
        const zoomY = height / size.height;
        const initialZoom = Math.max(zoomX, zoomY, 1);

        // console.log("cropSize", cropSize);
        console.log("containerRef", containerRef.current.getBoundingClientRect());
        // console.log("imageRef", size.width, imageRef.current.clientHeight);
        console.log("zoomX", zoomX);
        console.log("zoomY", zoomY);
        console.log("initialZoom", initialZoom);

        setMinZoom(initialZoom);
        onZoomChange(initialZoom);
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
                bgcolor: '#000',
                aspectRatio: '1 / 1',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: cropSize.width + 70,
                    height: cropSize.height + 70,
                }}
            >
                <Cropper
                    setImageRef={(ref: React.RefObject<HTMLImageElement>) => {
                        setImageRef(ref);
                    }}
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
                    onMediaLoaded={handleMediaLoaded}
                    restrictPosition
                    cropSize={cropSize}
                    objectFit="contain"
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        padding: '0 25px',
                    }}
                >
                    <Slider
                        min={minZoom}
                        max={10}
                        step={0.1}
                        value={zoom}
                        onChange={(_, value) => onZoomChange(value as number)}
                        sx={(t) => ({
                            '& .MuiSlider-thumb': {
                                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                    boxShadow: 'none',
                                },
                            },
                        })}
                    />
                </div>
            </div>
        </Box>
    );
};

export default CropperArea;
 