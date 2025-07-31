import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slider,
    Box,
    IconButton,
    Typography
} from '@mui/material';
import { Cancel, PhotoCamera, PhotoLibrary, Delete } from '@mui/icons-material';
import AvatarPlaceholder from './AvatarPlaceholder';
import getCroppedImg from '../utils/cropImage';

interface AddCropPhotoDialogProps {
    open: boolean;
    imageUrl?: string;
    nameForAvatar?: string;
    aspect?: number;
    cropShape?: 'rect' | 'round';
    onClose: () => void;
    onSave: (croppedImage: Blob, hasChanged: boolean) => void;
}

const AddCropPhotoDialog: React.FC<AddCropPhotoDialogProps> = ({
    open,
    imageUrl,
    nameForAvatar,
    aspect = 1,
    cropShape = 'round',
    onClose,
    onSave,
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [hasChanged, setHasChanged] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (imageUrl) setImageSrc(imageUrl);
        else if (nameForAvatar) setImageSrc(null);
    }, [imageUrl, nameForAvatar]);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSelectPhoto = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result as string);
            reader.readAsDataURL(file);
            setHasChanged(true);
        }
    };

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedImage) onSave(croppedImage, hasChanged);
    };

    const handleRemove = () => {
        setImageSrc(null);
        setHasChanged(true);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Edit Image</DialogTitle>
            <DialogContent>
                <Box sx={{ position: 'relative', width: '100%', pt: '100%', mb: 20 }}>
                    {imageSrc ? (
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                cropShape={cropShape}
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                restrictPosition
                            />
                        </div>
                    ) : (
                        <AvatarPlaceholder name={nameForAvatar || 'Avatar'} />
                    )}
                </Box>

                {imageSrc && (
                    <Box px={2} mb={2}>
                        <Slider
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(_, value) => setZoom(value as number)}
                        />
                    </Box>
                )}

                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={inputRef}
                    onChange={handleFileChange}
                />

                <Box display="flex" justifyContent="space-evenly" mt={2}>
                    <Button variant="outlined" startIcon={<PhotoLibrary />} onClick={handleSelectPhoto}>
                        Select Photo
                    </Button>
                    <Button variant="outlined" startIcon={<PhotoCamera />} onClick={() => alert('Camera logic')}>
                        Use Camera
                    </Button>
                    {imageSrc && hasChanged && (
                        <Button variant="outlined" startIcon={<Delete />} onClick={handleRemove}>
                            Remove Photo
                        </Button>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} startIcon={<Cancel />}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCropPhotoDialog;