import { useState } from 'react';

export const usePhotoEditor = (initialPhoto: string | null) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [original, setOriginal] = useState<string | null>(initialPhoto);

  const replace = (newPhoto: string) => setPhoto(newPhoto);
  const remove = () => setPhoto(null);
  const undo = () => setPhoto(original);

  const hasChanged = photo !== original;
  return { photo, replace, remove, undo, hasChanged, setOriginal };
};
