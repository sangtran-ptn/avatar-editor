import { Box, Button, Stack } from '@mui/material';

type Props = {
  onImageSelected: (src: string) => void;
  onRemovePhoto?: () => void;
};

const PhotoActions = ({ onImageSelected, onRemovePhoto }: Props) => {
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Stack spacing={1} mt={2}>
      <Button component="label" variant="outlined">
        Select Photo
        <input hidden type="file" accept="image/*" onChange={handleFileInput} />
      </Button>
      <Button variant="outlined" onClick={() => alert('Camera capture not implemented')}>
        Use Camera
      </Button>
      {onRemovePhoto && (
        <Button variant="text" color="error" onClick={onRemovePhoto}>
          Remove Photo
        </Button>
      )}
    </Stack>
  );
};

export default PhotoActions;
