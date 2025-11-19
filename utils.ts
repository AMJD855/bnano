/**
 * Resizes an image file to ensure it doesn't exceed max dimensions,
 * converting it to a Base64 string.
 * This helps prevent sending massive payloads to the API.
 */
export const processImageFile = (file: File, maxDimension = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to high-quality JPEG base64
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = (err) => reject(err);
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("FileReader result is empty"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const downloadImage = (dataUri: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUri;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};