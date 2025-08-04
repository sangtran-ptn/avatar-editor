import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack,
  DialogTitle,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface CameraDialogProps {
  open: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
  facingMode?: 'user' | 'environment';
}

export default function CameraDialog({
  open,
  onClose,
  onCapture,
  facingMode = 'environment',
}: CameraDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));

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
        console.error(err);
        setError('Không thể mở camera. Vui lòng kiểm tra quyền hoặc thiết bị.');
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [open, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, 'image/jpeg');
  };

  return (
    // <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
    // fullWidth maxWidth="sm" fullScreen={fullScreen}

    <Dialog open={open} onClose={onClose} fullScreen> 
      {/* <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">Camera</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle> */}
      <DialogContent
        sx={{
          p: 0,
          position: 'relative',
          bgcolor: 'black',
          //   height: fullScreen ? '100vh' : 600,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Video Preview */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Overlay Loading */}
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          )}

          {/* Overlay Buttons */}
          <Stack
            direction="row"
            spacing={4}
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={handleCapture}
              size="large"
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#eee' },
              }}
            >
              <CameraAltIcon fontSize="large" />
            </IconButton>

            <IconButton
              onClick={onClose}
              size="large"
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#eee' },
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Stack>
        </Box>

        {error && (
          <Box sx={{ p: 2, color: 'red', textAlign: 'center', width: '100%' }}>
            {error}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
