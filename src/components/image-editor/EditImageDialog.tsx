import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";

import ImageCropper from "./ImageCropper";
import AvatarPlaceholder from "./AvatarPlaceholder";
import { generateCroppedImageFile } from "./imageUtils";
import CameraDialog from "./CameraDialog";
import DialogHeader from "./DialogHeader";
import PhotoActionButtons from "./PhotoActionButtons";

interface EditImageDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (croppedFile: File | null, hasChanged: boolean) => void;
  imageUrl?: string;
  placeholderText?: string;
  isAvatar?: boolean;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({
  open,
  onClose,
  onSave,
  imageUrl,
  placeholderText,
  isAvatar = true,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [imageSrc, setImageSrc] = useState<string | null>(imageUrl || null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [showCameraDialog, setShowCameraDialog] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = useMemo(
    () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
      setHasChanged(true);
    },
    []
  );

  const handleUseCamera = () => {
    if (isMobile) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = handleFileChange as any;
      input.click();
    } else {
      setShowCameraDialog(true);
    }
  };

  const handleCapture = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setImageSrc(url);
    setShowCameraDialog(false);
    setHasChanged(true);
  };

  const handleRemovePhoto = () => {
    setImageSrc(null);
    setHasChanged(true);
  };

  const handleCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedFile = await generateCroppedImageFile(
        imageSrc,
        croppedAreaPixels
      );
      onSave(croppedFile, hasChanged);
    } else {
      onSave(null, hasChanged);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogHeader title="Edit Image" onClose={onClose} />

      <DialogContent sx={{ p: 0, position: "relative" }}>
        <Box
          ref={containerRef}
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxSizing: "border-box",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            aspectRatio: "1 / 1",
            padding: imageSrc ? 0 : 4.5,
          }}
        >
          {imageSrc ? (
            <ImageCropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={isAvatar ? 1 : 16 / 9}
              cropShape={isAvatar ? "round" : "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              containerRef={containerRef}
            />
          ) : (
            <AvatarPlaceholder text={placeholderText} />
          )}
        </Box>

        <CameraDialog
          open={showCameraDialog}
          onClose={() => setShowCameraDialog(false)}
          onCapture={handleCapture}
        />

        <PhotoActionButtons
          imageSrc={imageSrc}
          onSelectPhoto={() => inputRef.current?.click()}
          onUseCamera={handleUseCamera}
          onRemovePhoto={handleRemovePhoto}
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditImageDialog;
