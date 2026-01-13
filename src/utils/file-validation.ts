interface ValidationResult {
  readonly valid: boolean;
  readonly error?: string;
}

export const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PAGE_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates an image file for cover upload
 */
export function validateCoverImage(file: File): ValidationResult {
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "არასწორი ფაილის ფორმატი. გამოიყენეთ სურათის ფაილი",
    };
  }

  if (file.size > MAX_COVER_IMAGE_SIZE) {
    return {
      valid: false,
      error: `ფაილის ზომა ძალიან დიდია (მაქსიმუმი ${MAX_COVER_IMAGE_SIZE / 1024 / 1024}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Validates an image file for page upload
 */
export function validatePageImage(file: File): ValidationResult {
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "არასწორი ფაილის ფორმატი. გამოიყენეთ სურათის ფაილი",
    };
  }

  if (file.size > MAX_PAGE_IMAGE_SIZE) {
    return {
      valid: false,
      error: `ფაილის ზომა ძალიან დიდია (მაქსიმუმი ${MAX_PAGE_IMAGE_SIZE / 1024 / 1024}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Validates multiple image files for page upload
 */
export function validatePageImages(files: File[]): ValidationResult {
  for (const file of files) {
    const result = validatePageImage(file);
    if (!result.valid) {
      return {
        valid: false,
        error: `${file.name}: ${result.error}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} ბაიტი`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} კბ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} მბ`;
}

/**
 * Creates a preview URL for an image file
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Creates preview URLs for multiple image files
 */
export async function createImagePreviews(
  files: File[],
): Promise<Array<{ file: File; preview: string; name: string; size: number }>> {
  return Promise.all(
    files.map(async (file) => ({
      file,
      preview: await createImagePreview(file),
      name: file.name,
      size: file.size,
    })),
  );
}
