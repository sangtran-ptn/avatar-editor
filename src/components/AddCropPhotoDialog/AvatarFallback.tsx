// File: components/AddCropPhotoDialog/AvatarFallback.tsx
import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';

interface AvatarFallbackProps {
  text?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ text }) => {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ p: 4 }}>
      <Avatar sx={{ width: 120, height: 120 }}>
        {text?.[0]?.toUpperCase() || '?'}
      </Avatar>
      <Typography variant="body2" sx={{ mt: 2 }}>No photo selected</Typography>
    </Stack>
  );
};

export default AvatarFallback;
