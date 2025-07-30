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



function App() {
  const [open, setOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSave = (croppedFile: File | null, hasChanged: boolean) => {
    if (croppedFile && hasChanged) {
      const newUrl = URL.createObjectURL(croppedFile);
      setPhotoUrl(newUrl);
      setUploadedFile(croppedFile);
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

export default App;
