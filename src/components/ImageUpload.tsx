import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";
import { ImageService, ImageUploadResult } from "@/services/imageService";

interface ImageUploadProps {
	onImagesSelected: (images: ImageUploadResult[]) => void;
	maxImages?: number;
	acceptedTypes?: ("profile" | "item")[];
	className?: string;
	label?: string;
	description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	onImagesSelected,
	maxImages = 5,
	acceptedTypes = ["item"],
	className = "",
	label = "Upload Images",
	description = "Drag and drop images here or click to browse",
}) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [previewImages, setPreviewImages] = useState<ImageUploadResult[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleFileSelect = useCallback(
		async (files: FileList) => {
			if (files.length === 0) return;

			setIsUploading(true);

			try {
				const fileArray = Array.from(files);
				const uploadPromises = fileArray.map((file) =>
					ImageService.uploadImage(file, acceptedTypes[0])
				);

				const uploadedImages = await Promise.all(uploadPromises);

				// Check if we're exceeding max images
				const totalImages = previewImages.length + uploadedImages.length;
				if (totalImages > maxImages) {
					toast({
						title: "Too many images",
						description: `You can only upload up to ${maxImages} images`,
						variant: "destructive",
					});
					setIsUploading(false);
					return;
				}

				const newPreviewImages = [...previewImages, ...uploadedImages];
				setPreviewImages(newPreviewImages);
				onImagesSelected(newPreviewImages);

				toast({
					title: "Images uploaded successfully",
					description: `${uploadedImages.length} image(s) uploaded`,
				});
			} catch (error) {
				toast({
					title: "Upload failed",
					description:
						error instanceof Error ? error.message : "Failed to upload images",
					variant: "destructive",
				});
			} finally {
				setIsUploading(false);
			}
		},
		[previewImages, maxImages, acceptedTypes, onImagesSelected, toast]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			const files = e.dataTransfer.files;
			if (files.length > 0) {
				handleFileSelect(files);
			}
		},
		[handleFileSelect]
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files) {
				handleFileSelect(files);
			}
		},
		[handleFileSelect]
	);

	const removeImage = useCallback(
		(imageId: string) => {
			const newImages = previewImages.filter((img) => img.id !== imageId);
			setPreviewImages(newImages);
			onImagesSelected(newImages);
		},
		[previewImages, onImagesSelected]
	);

	const openFileDialog = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	return (
		<div className={`space-y-4 ${className}`}>
			<div>
				<Label className="text-sm font-medium">{label}</Label>
				{description && (
					<p className="text-sm text-muted-foreground mt-1">{description}</p>
				)}
			</div>

			{/* Upload Area */}
			<Card
				className={`border-2 border-dashed transition-colors ${
					isDragOver
						? "border-primary bg-primary/5"
						: "border-muted-foreground/25 hover:border-muted-foreground/50"
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<CardContent className="p-6">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						{isUploading ? (
							<div className="flex flex-col items-center space-y-2">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
								<p className="text-sm text-muted-foreground">
									Uploading images...
								</p>
							</div>
						) : (
							<>
								<div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
									{acceptedTypes.includes("profile") ? (
										<Camera className="h-6 w-6 text-muted-foreground" />
									) : (
										<ImageIcon className="h-6 w-6 text-muted-foreground" />
									)}
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium">
										{isDragOver
											? "Drop images here"
											: "Drag and drop images here"}
									</p>
									<p className="text-xs text-muted-foreground">
										or click to browse files
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={openFileDialog}
									disabled={isUploading}
								>
									<Upload className="mr-2 h-4 w-4" />
									Choose Files
								</Button>
							</>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Hidden file input */}
			<Input
				ref={fileInputRef}
				type="file"
				multiple
				accept="image/*"
				onChange={handleFileInputChange}
				className="hidden"
			/>

			{/* Image Previews */}
			{previewImages.length > 0 && (
				<div className="space-y-3">
					<Label className="text-sm font-medium">Preview</Label>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{previewImages.map((image, index) => (
							<div key={image.id} className="relative group">
								<div className="aspect-square rounded-lg overflow-hidden border bg-muted">
									<img
										src={image.url}
										alt={`Preview ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</div>
								<Button
									type="button"
									variant="destructive"
									size="sm"
									className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => removeImage(image.id)}
								>
									<X className="h-3 w-3" />
								</Button>
								{index === 0 && (
									<div className="absolute bottom-2 left-2">
										<span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
											Primary
										</span>
									</div>
								)}
							</div>
						))}
					</div>
					<p className="text-xs text-muted-foreground">
						{previewImages.length} of {maxImages} images selected
					</p>
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
