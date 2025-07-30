import React, { useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import AvatarWithInitials from '../components/AvatarWithInitials';
import ProfileForm from '../components/ProfileForm';
import PhotoEditDialog from '../components/dialogs/PhotoEditDialog';
import { usePhotoEditor } from '../hooks/usePhotoEditor';

type User = { email: string; firstName?: string; lastName?: string; photoUrl: string | null };

const ProfilePage: React.FC = () => {
  const mockUser: User = { email: 'user@example.com', firstName: '', lastName: '', photoUrl: null };
  const [user, setUser] = useState(mockUser);
  const [editing, setEditing] = useState(false);
  const photoEditor = usePhotoEditor(user.photoUrl);

  const handleSubmit = (values: any) => {
    setUser((u) => ({ ...u, firstName: values.firstName, lastName: values.lastName }));
    setEditing(false);
  };

  const handlePhotoSave = (blob: Blob | null) => {
    // convert blob lên URL để demo
    const url = blob ? URL.createObjectURL(blob) : null;
    photoEditor.setOriginal(url);
    setUser((u) => ({ ...u, photoUrl: url }));
    setEditing(false);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} display="flex" alignItems="center" gap={2}>
        {photoEditor.photo ? (
          <img src={photoEditor.photo} alt="avatar" width={80} height={80} style={{ borderRadius: '50%' }} />
        ) : (
          <AvatarWithInitials firstName={user.firstName} lastName={user.lastName} />
        )}
        <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
      </Box>

      {editing ? (
        <>
          <ProfileForm initialValues={user} onSubmit={handleSubmit} onCancel={() => setEditing(false)} />
          <Box mt={2}>
            <Button variant="outlined" onClick={() => {/* open picker? */}}>Edit Photo</Button>
          </Box>
          <PhotoEditDialog
            open={true}
            initialPhoto={photoEditor.photo}
            aspect={1}
            onClose={() => setEditing(false)}
            onSave={handlePhotoSave}
          />
        </>
      ) : (
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => setEditing(true)}>Edit Profile</Button>
      )}
    </Container>
  );
};

export default ProfilePage;
