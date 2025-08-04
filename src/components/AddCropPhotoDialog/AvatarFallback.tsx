import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { argbIntToCssColor } from './utils'

interface AvatarFallbackProps {
  text?: string;
   containerRef: React.RefObject<HTMLDivElement | null>;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ text, containerRef }) => {

  const colorFromDB = "4288074715";
  const backgroundColor = argbIntToCssColor(parseInt(colorFromDB, 10));

  const textColorFromDB = "4294967295";
  const textColor = argbIntToCssColor(parseInt(textColorFromDB, 10));

  return (
    // <Box
    //   sx={{
    //     position: 'relative',
    //     width: '100%',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     boxSizing: 'border-box',
    //     bgcolor: 'rgba(0, 0, 0, 0.5)',
    //     aspectRatio: '1 / 1',
    //     padding: 4.5,
    //   }}>
      <Avatar sx={{ width: '100%', height: '100%', bgcolor: backgroundColor, color: textColor, fontSize: 220 }}>
        {text?.[0]?.toUpperCase() || '?'}
      </Avatar>
    // </Box>

    // <Stack alignItems="center" justifyContent="center" sx={{ p: 4 }}>
    //   <Avatar sx={{ width: 120, height: 120, bgcolor: backgroundColor, color: textColor }}>
    //     {text?.[0]?.toUpperCase() || '?'}
    //   </Avatar>
    //   <Typography variant="body2" sx={{ mt: 2 }}>No photo selected</Typography>
    // </Stack>
  );
};

export default AvatarFallback;
