// import React, { useState } from 'react';
// import AddCropPhotoDialog from './components/AddCropPhotoDialog';

// function App() {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

//   const handleSave = (blob: Blob, hasChanged: boolean) => {
//     if (hasChanged) {
//       const objectUrl = URL.createObjectURL(blob);
//       setAvatarUrl(objectUrl);

//       // Optionally: upload to server here
//     }
//     setDialogOpen(false);
//   };

//   return (
//     <>
//       <img
//         src={avatarUrl || 'https://via.placeholder.com/150'}
//         alt="Avatar"
//         style={{ width: 100, height: 100, borderRadius: '50%' }}
//       />
//       <button onClick={() => setDialogOpen(true)}>Edit Avatar</button>

//       <AddCropPhotoDialog
//         open={dialogOpen}
//         imageUrl={avatarUrl}
//         nameForAvatar="Sang Tran"
//         onClose={() => setDialogOpen(false)}
//         onSave={handleSave}
//       />
//     </>
//   );
// };

// export default App;





// import React, { useState } from "react";
// import {AvatarEditor} from "./components/AvatarEditor";
// import { Avatar, Box, Button } from "@mui/material";
// import PhotoDialog from "./components/PhotoDialog/PhotoDialog";

// export default function App() {


//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
//   const [userName] = useState('Jane Doe');

//   const handleSavePhoto = (imageBlob: Blob, hasChanged: boolean) => {
//     if (!hasChanged) return;

//     const objectUrl = URL.createObjectURL(imageBlob);
//     setAvatarUrl(objectUrl);

//     // Optional: upload imageBlob to server or save in state
//     console.log('New avatar saved!', imageBlob);
//   };

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//       <Avatar
//         src={avatarUrl}
//         sx={{ width: 120, height: 120 }}
//       />
//       <Button variant="contained" onClick={() => setDialogOpen(true)}>
//         Change Photo
//       </Button>

//       <PhotoDialog
//         open={dialogOpen}
//         imageUrl={avatarUrl}
//         defaultAvatarText={userName}
//         onClose={() => setDialogOpen(false)}
//         onSave={handleSavePhoto}
//       />
//     </Box>
//   );



//   // // Hàm nhận ảnh đã crop (blob), ví dụ upload lên server hoặc convert sang base64
//   // const handleCropComplete = (croppedBlob: Blob | null) => {
//   //   if (!croppedBlob) return;
//   //   // Ví dụ convert blob thành base64 để preview hoặc upload
//   //   const reader = new FileReader();
//   //   reader.readAsDataURL(croppedBlob);
//   //   reader.onloadend = () => {
//   //     const base64data = reader.result;
//   //     console.log("Cropped image base64", base64data);
//   //     // Bạn có thể set vào state để hiển thị preview hoặc gửi lên API
//   //   };
//   // };

//   // return (
//   //   <div>
//   //     <h1>Avatar Editor Demo</h1>
//   //     <AvatarEditor
//   //       cropShape="round" // hoặc "rect"
//   //       onCropComplete={handleCropComplete}
//   //     />
//   //   </div>
//   // );
// }

import React, { useState } from 'react';
import AddCropPhotoDialog from './components/AddCropPhotoDialog/AddCropPhotoDialog';
import { Button, Avatar, Stack } from '@mui/material';



function App2() {
  const [open, setOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSave = (croppedFile: File | null, hasChanged: boolean) => {
    if (croppedFile && hasChanged) {
      const newUrl = URL.createObjectURL(croppedFile);
      setPhotoUrl(newUrl);
      setUploadedFile(croppedFile);
    }

    if (!croppedFile) {
      setPhotoUrl(undefined);
      setUploadedFile(null);
    }
  };

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
      <Avatar
        src={photoUrl}
        sx={{ width: 120, height: 120 }}
      />
      <Button variant="contained" onClick={() => setOpen(true)}>Edit Image</Button>

      <AddCropPhotoDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        imageUrl={photoUrl}
        placeholderText="Jane Doe"
        isAvatar={true}
      />
    </Stack>
  );
}

export default App2;


// import React, { useState } from 'react';
// import { Box, Button, Avatar, Typography, useMediaQuery, useTheme } from '@mui/material';
// import { AddCropPhotoDialog } from './components/AddCropPhotoDialog-old';

// function App() {
//   const [open, setOpen] = useState(false);
//   const [photoUrl, setPhotoUrl] = useState<string | null>(null);
//   const [croppedPhotoUrl, setCroppedPhotoUrl] = useState<string | null>(null);
//   const [hasChanged, setHasChanged] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleSave = async (file: Blob | null, changed: boolean, preResizedUrl: string | null) => {
//     setHasChanged(changed);
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setPhotoUrl(preResizedUrl);
//       setCroppedPhotoUrl(url);
//     } else if (changed) {
//       setPhotoUrl(null);
//       setCroppedPhotoUrl(null);
//     }
//     setOpen(false);
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map((n) => n[0])
//       .join('');
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 2,
//         pt: 4,
//       }}
//     >
//       <Typography variant="h6">Profile Photo</Typography>

//       <Avatar
//         src={croppedPhotoUrl || undefined}
//         sx={{
//           width: isMobile ? 100 : 140,
//           height: isMobile ? 100 : 140,
//           fontSize: 40,
//           bgcolor: croppedPhotoUrl ? 'transparent' : 'primary.main',
//         }}
//       >
//         {!croppedPhotoUrl && getInitials('Alice Brown')}
//       </Avatar>

//       <Button
//         variant="contained"
//         size="large"
//         onClick={handleOpen}
//         sx={{ textTransform: 'none', borderRadius: 4, px: 4 }}
//       >
//         {photoUrl ? 'Replace Photo' : 'Add Photo'}
//       </Button>

//       <AddCropPhotoDialog
//         open={open}
//         initialUrl={photoUrl}
//         placeholderText="Alice Brown"
//         aspect={1}
//         onClose={handleClose}
//         onSave={handleSave}
//       />
//     </Box>
//   );
// };

// export default App;