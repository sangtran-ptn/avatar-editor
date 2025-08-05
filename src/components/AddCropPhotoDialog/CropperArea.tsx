import React, { useEffect, useState, useCallback } from "react";
import Cropper, { MediaSize } from "react-easy-crop";
import { Slider } from "@mui/material";

interface CropperAreaProps {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  cropShape: "round" | "rect";
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
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
  containerRef,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
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
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cropSize = {
    width: containerWidth - 72,
    height: containerWidth - 72,
  };

  const handleMediaLoaded = useCallback((size: MediaSize) => {
    setMediaSize(size);
    console.log("Media size loaded:", size, mediaSize);

    if (!containerRef.current) return;

    const height = containerRef.current.getBoundingClientRect().width - 70;

    const zoomX = height / size.width;
    const zoomY = height / size.height;
    const initialZoom = Math.max(zoomX, zoomY);

    // console.log("containerRef", containerRef.current.getBoundingClientRect());
    // console.log("zoomX", zoomX);
    // console.log("zoomY", zoomY);
    // console.log("initialZoom", initialZoom);

    const maxZoomX = size.naturalWidth / height;
    const maxZoomY = size.naturalHeight / height;
    const maxZoom = Math.min(maxZoomX, maxZoomY);

    // console.log("maxZoomX", maxZoomX);
    // console.log("maxZoomY", maxZoomY);
    // console.log("maxZoom", maxZoom);

    setMinZoom(initialZoom);
    setMaxZoom(maxZoom);
    onZoomChange(initialZoom);
  }, []);

  function handleZoomChange(value: number) {
    if (value < minZoom || value > maxZoom) return;
    onZoomChange(value);
  }

  return (
    <>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        aspect={aspect}
        cropShape={cropShape}
        showGrid={false}
        onCropChange={onCropChange}
        onZoomChange={handleZoomChange}
        onCropComplete={onCropComplete}
        onMediaLoaded={handleMediaLoaded}
        restrictPosition
        cropSize={cropSize}
        objectFit="contain"
        zoomWithScroll={maxZoom > minZoom}
      />
      {maxZoom > minZoom && (
        <div
          style={{
            position: "absolute",
            bottom: 3,
            left: 0,
            right: 0,
            padding: "0 25px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Slider
            min={minZoom}
            max={maxZoom}
            step={0.1}
            value={zoom}
            onChange={(_, value) => onZoomChange(value as number)}
            sx={(t) => ({
              "& .MuiSlider-thumb": {
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            })}
          />
        </div>
      )}
    </>
  );
};

export default CropperArea;
