import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Stack } from '@mui/material';
import CropperCanvas from './CropperCanvas';
import AvatarPlaceholder from './AvatarPlaceholder';
import { readFileAsDataURL } from '../../utils/cropImage';

type Props = {
    open: boolean;
    imageUrl?: string;
    textPlaceholder?: string;
    onClose: () => void;
    onSave: (result: { croppedImage: string; changed: boolean }) => void;
};

export default function PhotoDialog({ open, imageUrl, textPlaceholder, onClose, onSave }: Props) {
    const [imageSrc, setImageSrc] = useState<string | null>(imageUrl ?? null);
    const [showRemove, setShowRemove] = useState(!!imageUrl);
    const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);

    const handleSelectPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (target?.files?.[0]) {
            const file = target.files[0];
            readFileAsDataURL(file).then((dataUrl) => {
                setImageSrc(dataUrl);
                setShowRemove(true);
            });
        }
    };

    const handleUseCamera = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (ev) => {
            const target = ev.target as HTMLInputElement;
            if (target?.files?.[0]) {
                readFileAsDataURL(target.files[0]).then((dataUrl) => {
                    setImageSrc(dataUrl);
                    setShowRemove(true);
                });
            }
        };
        input.click();
    };


    const handleSave = () => {
        if (imageSrc && croppedDataUrl) {
            onSave({ croppedImage: croppedDataUrl, changed: croppedDataUrl !== imageUrl });
        } else {
            onClose();
        }
    };

    const handleRemove = () => {
        setImageSrc(null);
        setShowRemove(false);
    };

    return (
        <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogContent>
                {imageSrc ? (
                    <CropperCanvas imageSrc={imageSrc} onCropComplete={setCroppedDataUrl} />
                ) : (
                    <AvatarPlaceholder text={textPlaceholder || 'User'} />
                )}
                <Stack direction="row" spacing={2} mt={2}>
                    <Button variant="outlined" onClick={() => document.getElementById('fileInput')?.click()}>
                        Select Photo
                    </Button>
                    <Button variant="outlined" onClick={handleUseCamera}>
                        Use Camera
                    </Button>
                    {showRemove && (
                        <Button variant="outlined" color="error" onClick={handleRemove}>
                            Remove Photo
                        </Button>
                    )}
                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        hidden
                        onChange={handleSelectPhoto}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={!imageSrc}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}
