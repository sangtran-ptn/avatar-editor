import { Avatar, Box } from '@mui/material';

type Props = {
  text: string;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const AvatarFallback = ({ text }: Props) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
      <Avatar sx={{ width: 120, height: 120 }}>{getInitials(text)}</Avatar>
    </Box>
  );
};

export default AvatarFallback;
