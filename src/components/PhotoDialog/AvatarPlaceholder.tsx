import { Box, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

type Props = {
  text: string;
};

export default function AvatarPlaceholder({ text }: Props) {
  const initials = text
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <Box
      sx={{
        width: '100%',
        pt: '100%',
        position: 'relative',
        backgroundColor: deepPurple[500],
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3">{initials}</Typography>
      </Box>
    </Box>
  );
}
