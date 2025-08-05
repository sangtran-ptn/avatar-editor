import React from "react";
import { Button, Stack } from "@mui/material";
import { PhotoCamera, Delete, Image } from "@mui/icons-material";

interface PhotoActionButtonsProps {
  imageSrc: string | null;
  onSelectPhoto: () => void;
  onUseCamera: () => void;
  onRemovePhoto: () => void;
}

const PhotoActionButtons: React.FC<PhotoActionButtonsProps> = ({
  imageSrc,
  onSelectPhoto,
  onUseCamera,
  onRemovePhoto,
}) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      <Button startIcon={<Image />} onClick={onSelectPhoto}>
        Select Photo
      </Button>
      <Button startIcon={<PhotoCamera />} onClick={onUseCamera}>
        Use Camera
      </Button>
      {imageSrc && (
        <Button startIcon={<Delete />} onClick={onRemovePhoto}>
          Remove Photo
        </Button>
      )}
    </Stack>
  );
};

export default PhotoActionButtons;
