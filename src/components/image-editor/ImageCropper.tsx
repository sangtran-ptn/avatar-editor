import React, { useEffect, useState, useCallback } from "react";
import Cropper, { MediaSize } from "react-easy-crop";
import { Slider } from "@mui/material";

interface ImageCropperProps {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  cropShape: "round" | "rect";
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: any, croppedPixels: any) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
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

  useEffect(() => {
    const updateContainerSize = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [containerRef]);

  const cropSize = {
    width: containerWidth - 72,
    height: containerWidth - 72,
  };

  const handleMediaLoaded = useCallback(
    (mediaSize: MediaSize) => {
      const containerSize =
        containerRef.current?.getBoundingClientRect().width || 0;
      const viewPort = containerSize - 70;

      const zoomX = viewPort / mediaSize.width;
      const zoomY = viewPort / mediaSize.height;
      const initialZoom = Math.max(zoomX, zoomY);

      const maxZoomX = mediaSize.naturalWidth / viewPort;
      const maxZoomY = mediaSize.naturalHeight / viewPort;
      const computedMaxZoom = Math.min(maxZoomX, maxZoomY);

      setMinZoom(initialZoom);
      setMaxZoom(computedMaxZoom);
      onZoomChange(initialZoom);
    },
    [containerRef, onZoomChange]
  );

  const handleZoomSliderChange = (_: Event, value: number | number[]) => {
    if (typeof value === "number") {
      if (value >= minZoom && value <= maxZoom) {
        onZoomChange(value);
      }
    }
  };

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
        onZoomChange={onZoomChange}
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
            onChange={handleZoomSliderChange}
            sx={{
              "& .MuiSlider-thumb": {
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default ImageCropper;
