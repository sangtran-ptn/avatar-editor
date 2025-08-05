/**
 * Load an image from a URL and return it as an HTMLImageElement.
 * @param url - Image source URL.
 * @returns A Promise resolving to the loaded image element.
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

/**
 * Generate a cropped image file (JPEG) from the original image source and pixel crop area.
 * @param imageSrc - The image source URL.
 * @param crop - Pixel crop information.
 * @returns A Promise resolving to a JPEG file.
 */
export const generateCroppedImageFile = async (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<File> => {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx?.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
};

/**
 * Convert ARGB integer to a valid CSS color string.
 * @param argb - ARGB integer.
 * @returns CSS color string (e.g. rgba(...) or hex).
 */
export const argbIntToCssColor = (argb: number): string => {
  const alpha = (argb >> 24) & 0xff;
  const red = (argb >> 16) & 0xff;
  const green = (argb >> 8) & 0xff;
  const blue = argb & 0xff;

  const opacity = +(alpha / 255).toFixed(2);

  return opacity < 1
    ? `rgba(${red}, ${green}, ${blue}, ${opacity})`
    : `#${[red, green, blue].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};
