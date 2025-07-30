import React from 'react';
import { Avatar } from '@mui/material';
import { getAvatarColor } from '../utils/avatarColor';

interface Props {
  firstName?: string;
  lastName?: string;
}

const AvatarWithInitials: React.FC<Props> = ({ firstName, lastName }) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  const bgColor = getAvatarColor(initials);
  return <Avatar sx={{ bgcolor: bgColor }}>{initials || '?'}</Avatar>;
};

export default AvatarWithInitials;
