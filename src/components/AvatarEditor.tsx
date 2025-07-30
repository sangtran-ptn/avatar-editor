import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import {
  Box,
  Button,
  Slider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Webcam from "react-webcam";

interface AvatarEditorProps {
  cropShape?: "round" | "rect";
  onCropComplete?: (croppedBlob: Blob | null) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  cropShape: "round" | "rect"
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const size = 300;

  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);

  if (cropShape === "round") {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  cropShape = "round",
  onCropComplete,
}) => {
  const theme = useTheme();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);
  const [showWebcam, setShowWebcam] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null); // base64 preview

  const webcamRef = useRef<Webcam>(null);

  const onCropCompleteInternal = useCallback(
    (
      _: { x: number; y: number },
      croppedAreaPixelsParam: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixelsParam);
    },
    []
  );

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      // Tính toán zoom tối thiểu để ảnh phủ kín crop
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      const cropSize = 200; // cropSize đang đặt là 200x200
      const minZoom = Math.max(
        cropSize / img.width,
        cropSize / img.height,
        1 // không nhỏ hơn 1
      );
      setZoom(minZoom);
    };

      setCroppedImage(null); // reset preview khi đổi ảnh mới
      setImageSrc(url);
      setShowWebcam(false);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      e.target.value = "";
    }
  };

  const captureWebcam = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImageSrc(screenshot);
        setShowWebcam(false);
        setCroppedImage(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const blob = await getCroppedImg(imageSrc, croppedAreaPixels, cropShape);
    if (onCropComplete) onCropComplete(blob || null);

    // Convert blob -> base64 để preview
    if (blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setCroppedImage(reader.result as string);
      };
    }
  };

  const resetEditor = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppedImage(null);
  };

  const cropperShape = cropShape === "round" ? "round" : "rect";

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Stack spacing={2} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" component="label">
            Select Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onSelectFile}
            />
          </Button>

          <Button
            variant="outlined"
            onClick={() => setShowWebcam((show) => !show)}
          >
            {showWebcam ? "Close Camera" : "Use Camera"}
          </Button>

          <Button color="error" variant="text" onClick={resetEditor}>
            Reset
          </Button>
        </Stack>

        {showWebcam && (
          <Box
            sx={{
              width: 300,
              height: 300,
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={captureWebcam}
              sx={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              Capture
            </Button>
          </Box>
        )}

        {imageSrc && (
          <Box
            sx={{
              position: "relative",
              width: 300,
              height: 300,
              borderRadius: 0,
              overflow: "hidden",
              backgroundColor: theme.palette.grey[900],
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape={cropperShape}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteInternal}
              showGrid={false}
              objectFit="horizontal-cover"
              cropSize={{ width: 200, height: 200 }}
            />
          </Box>
        )}

        {imageSrc && (
          <Box sx={{ width: 300 }}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              onChange={(_, val) => setZoom(val as number)}
            />
          </Box>
        )}

        {imageSrc && (
          <Button variant="contained" onClick={handleCropSave}>
            Save Crop
          </Button>
        )}

        {/* Preview ảnh crop */}
        {croppedImage && (
          <Box mt={3} textAlign="center">
            <Typography variant="subtitle1" gutterBottom>
              Preview Cropped Image
            </Typography>
            <Box
              component="img"
              src={croppedImage}
              alt="Cropped preview"
              sx={{
                width: 150,
                height: 150,
                borderRadius: cropShape === "round" ? "50%" : 0,
                objectFit: "cover",
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};
