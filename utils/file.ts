import {ImageSize} from "~/utils/ImageSize";

/**
 * Get the size of an image file.
 */
export function getImageSize(file: File): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const fileUrl = URL.createObjectURL(file);

    image.onerror = reject;
    image.onload = () => {
      URL.revokeObjectURL(fileUrl);
      resolve(new ImageSize(image.width, image.height));
    };

    image.src = fileUrl;
  });
}
