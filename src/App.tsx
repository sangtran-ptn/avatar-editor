import React, { useState } from 'react';
import { Container, Box, Avatar, Button, Typography } from '@mui/material';
import PhotoDialog from './components/PhotoDialog';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleOpenDialog = () => setDialogOpen(true);

  const handleCloseDialog = () => setDialogOpen(false);

  const handleSave = ({ croppedImage, changed }: { croppedImage: string; changed: boolean }) => {
    if (changed) {
      // Example upload simulation
      console.log('Uploading cropped image...');
      // Normally here you would POST to your server
      setAvatarUrl(croppedImage);
    }
    setDialogOpen(false);
  };

  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Profile Photo
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={avatarUrl || undefined}
          sx={{ width: 120, height: 120, fontSize: 40 }}
        >
          {!avatarUrl && 'JD'}
        </Avatar>

        <Button variant="contained" onClick={handleOpenDialog}>
          Edit Photo
        </Button>
      </Box>

      <PhotoDialog
        open={dialogOpen}
        imageUrl={avatarUrl ?? undefined}
        textPlaceholder="John Doe"
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </Container>
  );
}

export default App;
