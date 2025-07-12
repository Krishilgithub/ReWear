// Image Upload Service for ReWear
// Handles file uploads, image processing, and storage

export interface ImageUploadResult {
	id: string;
	url: string;
	publicId: string;
	filename: string;
	size: number;
	mimeType: string;
}

export interface ImageValidationResult {
	isValid: boolean;
	error?: string;
}

export class ImageService {
	private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	private static readonly ALLOWED_TYPES = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
	];
	private static readonly MAX_DIMENSION = 2048; // Max width/height

	// Validate image file
	static validateImage(file: File): ImageValidationResult {
		// Check file size
		if (file.size > this.MAX_FILE_SIZE) {
			return {
				isValid: false,
				error: `File size must be less than ${
					this.MAX_FILE_SIZE / 1024 / 1024
				}MB`,
			};
		}

		// Check file type
		if (!this.ALLOWED_TYPES.includes(file.type)) {
			return {
				isValid: false,
				error: "Only JPEG, PNG, and WebP images are allowed",
			};
		}

		return { isValid: true };
	}

	// Process and upload image
	static async uploadImage(
		file: File,
		type: "profile" | "item"
	): Promise<ImageUploadResult> {
		// Validate the image
		const validation = this.validateImage(file);
		if (!validation.isValid) {
			throw new Error(validation.error);
		}

		// Create a unique ID for the image
		const imageId = `img_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		// Process the image (resize if needed)
		const processedImage = await this.processImage(file);

		// Convert to base64 for localStorage storage
		const base64Url = await this.fileToBase64(processedImage);

		// Create result object
		const result: ImageUploadResult = {
			id: imageId,
			url: base64Url,
			publicId: `${type}_${imageId}`,
			filename: file.name,
			size: processedImage.size,
			mimeType: processedImage.type,
		};

		return result;
	}

	// Process image (resize if too large)
	private static async processImage(file: File): Promise<File> {
		return new Promise((resolve) => {
			const img = new Image();
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;

			img.onload = () => {
				// Calculate new dimensions
				let { width, height } = img;

				if (width > this.MAX_DIMENSION || height > this.MAX_DIMENSION) {
					if (width > height) {
						height = (height * this.MAX_DIMENSION) / width;
						width = this.MAX_DIMENSION;
					} else {
						width = (width * this.MAX_DIMENSION) / height;
						height = this.MAX_DIMENSION;
					}
				}

				// Set canvas dimensions
				canvas.width = width;
				canvas.height = height;

				// Draw and resize image
				ctx.drawImage(img, 0, 0, width, height);

				// Convert to blob
				canvas.toBlob(
					(blob) => {
						if (blob) {
							const processedFile = new File([blob], file.name, {
								type: file.type,
								lastModified: Date.now(),
							});
							resolve(processedFile);
						} else {
							resolve(file); // Fallback to original file
						}
					},
					file.type,
					0.8
				); // 80% quality
			};

			img.src = URL.createObjectURL(file);
		});
	}

	// Convert file to base64
	private static fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	// Delete image (clean up localStorage)
	static deleteImage(imageId: string): void {
		// In a real app, this would delete from cloud storage
		// For now, we just return as localStorage cleanup is handled elsewhere
		console.log(`Image ${imageId} marked for deletion`);
	}

	// Get image dimensions
	static getImageDimensions(
		file: File
	): Promise<{ width: number; height: number }> {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};
			img.src = URL.createObjectURL(file);
		});
	}

	// Generate thumbnail URL
	static generateThumbnailUrl(
		imageUrl: string,
		width: number = 150,
		height: number = 150
	): string {
		// In a real app, this would use a CDN or image processing service
		// For now, return the original URL
		return imageUrl;
	}
}

// Export singleton instance
export const imageService = new ImageService();
