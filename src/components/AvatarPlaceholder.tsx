import React from 'react';
import { Avatar, Box } from '@mui/material';

interface AvatarPlaceholderProps {
  name: string;
}

const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += (`00${value.toString(16)}`).slice(-2);
  }
  return color;
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({ name }) => {
  return (
    <Box
      sx={{
        width: '100%',
        pt: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Avatar
        sx={{
          bgcolor: stringToColor(name),
          width: '100%',
          height: '100%',
          fontSize: 48,
          position: 'absolute',
        }}
        variant="circular"
      >
        {getInitials(name)}
      </Avatar>
    </Box>
  );
};

export default AvatarPlaceholder;
