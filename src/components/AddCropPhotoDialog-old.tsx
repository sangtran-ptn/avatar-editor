export {};

// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton,
//   Slider,
//   Avatar,
//   Box,
//   Typography,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import Cropper, { Area, MediaSize } from 'react-easy-crop';
// import { getCroppedImg } from './cropUtils';

// const MARGIN_VERTICAL = 35; // px
// const MARGIN_HORIZONTAL = 15; // px

// interface AddCropPhotoDialogProps {
//   open: boolean;
//   initialUrl: string | null;
//   placeholderText?: string;
//   aspect?: number;
//   onClose: () => void;
//   onSave: (blob: Blob | null, changed: boolean, preResizedUrl: string | null) => void;
// }

// export const AddCropPhotoDialog: React.FC<AddCropPhotoDialogProps> = ({
//   open,
//   initialUrl,
//   placeholderText = '',
//   aspect = 1,
//   onClose,
//   onSave,
// }) => {
//   const [imageSrc, setImageSrc] = useState<string | null>(initialUrl);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
//   const [mediaSize, setMediaSize] = useState<MediaSize | null>(null);
//   const [changed, setChanged] = useState(false);
//   const inputFileRef = useRef<HTMLInputElement>(null);
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   useEffect(() => {
//     setImageSrc(initialUrl);
//     setZoom(1);
//     setCrop({ x: 0, y: 0 });
//     setChanged(false);
//   }, [initialUrl, open]);

//   const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
//     setCroppedAreaPixels(areaPixels);
//   }, []);

//   const handleMediaLoaded = useCallback((size: MediaSize) => {
//     setMediaSize(size);
//   }, []);

// //   useEffect(() => {
// //     if (!mediaSize) return;

// //     const containerWidth = window.innerWidth * 0.9; // Approximate dialog width
// //     const containerHeight = containerWidth;
// //     const cropWidth = containerWidth - 2 * MARGIN_HORIZONTAL;
// //     const cropHeight = containerHeight - 2 * MARGIN_VERTICAL;
// //     const cropDiameter = Math.min(cropWidth, cropHeight);

// //     const scaleX = cropDiameter / mediaSize.width;
// //     const scaleY = cropDiameter / mediaSize.height;
// //     const requiredZoom = Math.max(scaleX, scaleY, 1);

// //     setZoom(requiredZoom);
// //   }, [mediaSize]);

//   const handleSelectFile = () => {
//     if (inputFileRef.current) {
//       inputFileRef.current.removeAttribute('capture');
//       inputFileRef.current.click();
//     }
//   };

//   const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setImageSrc(url);
//       setChanged(true);
//     }
//   };

//   const handleUseCamera = () => {
//     if (inputFileRef.current) {
//       inputFileRef.current.setAttribute('capture', 'environment');
//       inputFileRef.current.click();
//     }
//   };

//   const handleRemove = () => {
//     setImageSrc(null);
//     setChanged(true);
//   };

//   const handleSave = async () => {
//     if (imageSrc && croppedAreaPixels) {
//       const blob = await getCroppedImg(imageSrc, croppedAreaPixels, aspect);
//       onSave(blob, changed, imageSrc);
//     } else {
//       onSave(null, changed, null);
//     }
//     handleClose();
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
//       <DialogTitle sx={{ m: 0, p: 2 }}>
//         <Typography variant="h6">Edit Image</Typography>
//         <IconButton
//           aria-label="close"
//           onClick={handleClose}
//           sx={{ position: 'absolute', right: 8, top: 8 }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 0, position: 'relative' }}>
//         {imageSrc ? (
//           <Box
//             sx={{
//               position: 'relative',
//               width: '100%',
//               pt: `${MARGIN_VERTICAL}px`,
//               pb: `${MARGIN_VERTICAL + 40}px`,
//               px: `${MARGIN_HORIZONTAL}px`,
//               boxSizing: 'border-box',
//               bgcolor: '#000',
//               aspectRatio: '1 / 1',
//             }}
//           >
//             <Cropper
//               image={imageSrc}
//               crop={crop}
//               zoom={zoom}
//               aspect={aspect}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={onCropComplete}
//               onMediaLoaded={handleMediaLoaded}
//               cropShape="round"
//               showGrid={false}
//               restrictPosition
//               style={{
//                 containerStyle: {
//                   width: '100%',
//                   height: '100%',
//                   position: 'absolute',
//                 },
//                 cropAreaStyle: {
//                   border: 'none',
//                   boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
//                 },
//               }}
//             />
//             <Box
//               sx={{
//                 position: 'absolute',
//                 bottom: 10,
//                 left: MARGIN_HORIZONTAL,
//                 right: MARGIN_HORIZONTAL,
//               }}
//             >
//               <Slider
//                 value={zoom}
//                 min={1}
//                 max={5}
//                 step={0.01}
//                 onChange={(_, v) => setZoom(v as number)}
//               />
//             </Box>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               width: '100%',
//               aspectRatio: '1 / 1',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               bgcolor: '#f0f0f0',
//             }}
//           >
//             <Avatar src={imageSrc ?? undefined} sx={{ width: 100, height: 100, fontSize: 32 }}>
//               {placeholderText
//                 .split(' ')
//                 .map((n) => n[0])
//                 .join('')}
//             </Avatar>
//           </Box>
//         )}

//         <input
//           type="file"
//           accept="image/*"
//           ref={inputFileRef}
//           style={{ display: 'none' }}
//           onChange={onFileChange}
//         />
//       </DialogContent>

//       <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
//         <Box>
//           <Button onClick={handleSelectFile}>Select Photo</Button>
//           <Button onClick={handleUseCamera}>Use Camera</Button>
//           {imageSrc && <Button onClick={handleRemove}>Remove Photo</Button>}
//         </Box>
//         <Box>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>
//             Save
//           </Button>
//         </Box>
//       </DialogActions>
//     </Dialog>
//   );
// };