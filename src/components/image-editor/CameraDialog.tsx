import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface CameraDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
  facingMode?: "user" | "environment";
}

const CameraDialog: React.FC<CameraDialogProps> = ({
  open,
  onClose,
  onCapture,
  facingMode = "environment",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setLoading(false);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [open, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, "image/jpeg");
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent
        sx={{
          p: 0,
          bgcolor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          )}

          <Stack
            direction="row"
            spacing={4}
            sx={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={handleCapture}
              size="large"
              sx={{ bgcolor: "white", "&:hover": { bgcolor: "#eee" } }}
            >
              <CameraAltIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={onClose}
              size="large"
              sx={{ bgcolor: "white", "&:hover": { bgcolor: "#eee" } }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Stack>

          {error && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                textAlign: "center",
                p: 2,
                color: "red",
              }}
            >
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDialog;
