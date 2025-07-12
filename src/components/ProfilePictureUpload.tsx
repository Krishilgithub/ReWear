import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X } from "lucide-react";
import { ImageService, ImageUploadResult } from "@/services/imageService";

interface ProfilePictureUploadProps {
	currentPicture?: string;
	onPictureSelected: (image: ImageUploadResult | null) => void;
	userName: string;
	className?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
	currentPicture,
	onPictureSelected,
	userName,
	className = "",
}) => {
	const [isUploading, setIsUploading] = useState(false);
	const [previewImage, setPreviewImage] = useState<ImageUploadResult | null>(
		null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleFileSelect = useCallback(
		async (file: File) => {
			console.log("ProfilePictureUpload: Starting file upload", { file });
			setIsUploading(true);

			try {
				// Validate file before upload
				if (!file) {
					throw new Error("No file selected");
				}

				console.log("ProfilePictureUpload: File validation passed", {
					name: file.name,
					size: file.size,
					type: file.type,
				});

				const uploadedImage = await ImageService.uploadImage(file, "profile");
				console.log("ProfilePictureUpload: Upload successful", uploadedImage);

				setPreviewImage(uploadedImage);
				onPictureSelected(uploadedImage);

				toast({
					title: "Profile picture updated",
					description: "Your profile picture has been uploaded successfully",
				});
			} catch (error) {
				console.error("ProfilePictureUpload: Upload failed", error);
				toast({
					title: "Upload failed",
					description:
						error instanceof Error ? error.message : "Failed to upload image",
					variant: "destructive",
				});
			} finally {
				setIsUploading(false);
			}
		},
		[onPictureSelected, toast]
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			console.log("ProfilePictureUpload: File input changed", e.target.files);
			const files = e.target.files;
			if (files && files.length > 0) {
				handleFileSelect(files[0]);
			}
		},
		[handleFileSelect]
	);

	const removePicture = useCallback(() => {
		console.log("ProfilePictureUpload: Removing picture");
		setPreviewImage(null);
		onPictureSelected(null);
		toast({
			title: "Profile picture removed",
			description: "Your profile picture has been removed",
		});
	}, [onPictureSelected, toast]);

	const openFileDialog = useCallback(() => {
		console.log("ProfilePictureUpload: Opening file dialog");
		fileInputRef.current?.click();
	}, []);

	const displayImage = previewImage?.url || currentPicture;
	const displayName = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	return (
		<div className={`space-y-4 ${className}`}>
			<Label className="text-sm font-medium">Profile Picture</Label>

			<div className="flex items-center space-x-4">
				{/* Avatar Display */}
				<div className="relative">
					<Avatar className="h-20 w-20">
						<AvatarImage
							src={displayImage}
							alt={`${userName}'s profile picture`}
						/>
						<AvatarFallback className="text-lg font-semibold">
							{displayName}
						</AvatarFallback>
					</Avatar>

					{/* Upload Overlay */}
					{!isUploading && (
						<Button
							type="button"
							size="sm"
							variant="secondary"
							className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-lg"
							onClick={openFileDialog}
						>
							<Camera className="h-4 w-4" />
						</Button>
					)}

					{/* Loading Overlay */}
					{isUploading && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col space-y-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={openFileDialog}
						disabled={isUploading}
					>
						<Upload className="mr-2 h-4 w-4" />
						{displayImage ? "Change Picture" : "Upload Picture"}
					</Button>

					{displayImage && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={removePicture}
							disabled={isUploading}
							className="text-destructive hover:text-destructive"
						>
							<X className="mr-2 h-4 w-4" />
							Remove Picture
						</Button>
					)}
				</div>
			</div>

			{/* Hidden file input */}
			<Input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileInputChange}
				className="hidden"
			/>

			{/* Help Text */}
			<p className="text-xs text-muted-foreground">
				Upload a clear photo of yourself. Recommended size: 400x400 pixels or
				larger. Supported formats: JPEG, PNG, WebP (max 5MB).
			</p>
		</div>
	);
};

export default ProfilePictureUpload;
