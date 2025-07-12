import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Plus } from "lucide-react";
import {
	ItemCategory,
	ItemType,
	ItemSize,
	ItemCondition,
	CreateItemForm,
} from "@/types";
import { itemsService } from "@/services/dataService";
import { ImageUploadResult } from "@/services/imageService";
import ImageUpload from "@/components/ImageUpload";

const addItemSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.nativeEnum(ItemCategory),
	type: z.nativeEnum(ItemType),
	size: z.nativeEnum(ItemSize),
	condition: z.nativeEnum(ItemCondition),
	points: z
		.number()
		.min(1, "Points must be at least 1")
		.max(1000, "Points cannot exceed 1000"),
	location: z.string().optional(),
	tags: z.array(z.string()).min(1, "At least one tag is required"),
});

type AddItemFormData = z.infer<typeof addItemSchema>;

const mockPreviousListings = [
	{ id: "1", image: "/placeholder-item.jpg" },
	{ id: "2", image: "/placeholder-item.jpg" },
	{ id: "3", image: "/placeholder-item.jpg" },
	{ id: "4", image: "/placeholder-item.jpg" },
];

const AddItem = () => {
	const { user } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();
	const { trackEvent } = useAnalytics();

	const [isLoading, setIsLoading] = useState(false);
	const [selectedImages, setSelectedImages] = useState<ImageUploadResult[]>([]);
	const [newTag, setNewTag] = useState("");

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<AddItemFormData>({
		resolver: zodResolver(addItemSchema),
		defaultValues: {
			tags: [],
			points: 10,
		},
	});

	const watchedTags = watch("tags", []);

	const handleImagesSelected = (images: ImageUploadResult[]) => {
		setSelectedImages(images);
	};

	const addTag = () => {
		if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
			const updatedTags = [...watchedTags, newTag.trim()];
			setValue("tags", updatedTags);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		const updatedTags = watchedTags.filter((tag) => tag !== tagToRemove);
		setValue("tags", updatedTags);
	};

	const onSubmit = async (data: AddItemFormData) => {
		if (!user) {
			toast({
				title: "Authentication required",
				description: "Please sign in to add an item.",
				variant: "destructive",
			});
			return;
		}
		if (selectedImages.length === 0) {
			toast({
				title: "Images required",
				description: "Please upload at least one image of your item.",
				variant: "destructive",
			});
			return;
		}
		setIsLoading(true);
		try {
			const itemData: CreateItemForm = {
				...data,
				images: selectedImages,
			};
			await itemsService.create(itemData, user.id, user.name);
			trackEvent("item_created", "items", "manual");
			toast({
				title: "Item added successfully!",
				description: "Your item is pending approval and will be visible soon.",
			});
			reset();
			setSelectedImages([]);
			navigate("/browse");
		} catch (error) {
			trackEvent("item_creation_failed", "items", "error");
			toast({
				title: "Failed to add item",
				description: "Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background p-8">
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<CardTitle>Add New Item</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col md:flex-row gap-8">
							{/* Left: Image Upload */}
							<div className="w-full md:w-1/2">
								<ImageUpload
									onImagesSelected={handleImagesSelected}
									maxImages={5}
									acceptedTypes={["item"]}
									label="Add Images"
									description="Upload clear photos of your item from different angles"
								/>
							</div>
							{/* Right: Product Details */}
							<div className="flex-1 space-y-4">
								<Label htmlFor="title">Title *</Label>
								<Input
									id="title"
									placeholder="e.g., Blue Denim Jacket"
									{...register("title")}
								/>
								{errors.title && (
									<p className="text-sm text-red-500">{errors.title.message}</p>
								)}

								<Label htmlFor="description">Add Product Description *</Label>
								<Textarea
									id="description"
									placeholder="Describe your item..."
									{...register("description")}
								/>
								{errors.description && (
									<p className="text-sm text-red-500">
										{errors.description.message}
									</p>
								)}

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="category">Category *</Label>
										<Select
											onValueChange={(val) =>
												setValue("category", val as ItemCategory)
											}
										>
											<SelectTrigger id="category">
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(ItemCategory).map((cat) => (
													<SelectItem key={cat} value={cat}>
														{cat}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.category && (
											<p className="text-sm text-red-500">
												{errors.category.message}
											</p>
										)}
									</div>
									<div>
										<Label htmlFor="type">Type *</Label>
										<Select
											onValueChange={(val) => setValue("type", val as ItemType)}
										>
											<SelectTrigger id="type">
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(ItemType).map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.type && (
											<p className="text-sm text-red-500">
												{errors.type.message}
											</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="size">Size *</Label>
										<Select
											onValueChange={(val) => setValue("size", val as ItemSize)}
										>
											<SelectTrigger id="size">
												<SelectValue placeholder="Select size" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(ItemSize).map((size) => (
													<SelectItem key={size} value={size}>
														{size}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.size && (
											<p className="text-sm text-red-500">
												{errors.size.message}
											</p>
										)}
									</div>
									<div>
										<Label htmlFor="condition">Condition *</Label>
										<Select
											onValueChange={(val) =>
												setValue("condition", val as ItemCondition)
											}
										>
											<SelectTrigger id="condition">
												<SelectValue placeholder="Select condition" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(ItemCondition).map((cond) => (
													<SelectItem key={cond} value={cond}>
														{cond}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{errors.condition && (
											<p className="text-sm text-red-500">
												{errors.condition.message}
											</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="points">Points Required *</Label>
										<Input
											id="points"
											type="number"
											min="1"
											max="1000"
											placeholder="10"
											{...register("points", { valueAsNumber: true })}
										/>
										{errors.points && (
											<p className="text-sm text-red-500">
												{errors.points.message}
											</p>
										)}
									</div>
									<div>
										<Label htmlFor="location">Location (Optional)</Label>
										<Input
											id="location"
											placeholder="e.g., New York, NY"
											{...register("location")}
										/>
									</div>
								</div>

								<div>
									<Label>Add Tags *</Label>
									<div className="flex space-x-2 mt-1">
										<Input
											placeholder="e.g., blue, cotton, vintage"
											value={newTag}
											onChange={(e) => setNewTag(e.target.value)}
											onKeyPress={(e) =>
												e.key === "Enter" && (e.preventDefault(), addTag())
											}
										/>
										<Button type="button" onClick={addTag} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									{errors.tags && (
										<p className="text-sm text-red-500">
											{errors.tags.message}
										</p>
									)}
									{watchedTags.length > 0 && (
										<div className="flex flex-wrap gap-2 mt-2">
											{watchedTags.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="flex items-center space-x-1"
												>
													<span>{tag}</span>
													<button
														type="button"
														onClick={() => removeTag(tag)}
														className="ml-1 hover:text-red-500"
													>
														×
													</button>
												</Badge>
											))}
										</div>
									)}
								</div>

								<Button
									type="submit"
									className="w-full mt-4"
									disabled={isLoading}
								>
									{isLoading ? "Adding Item..." : "Add Item"}
								</Button>
							</div>
						</div>
					</form>
					<Separator className="my-8" />
					{/* Previous Listings */}
					<div>
						<h3 className="font-semibold mb-4">Previous Listings</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{mockPreviousListings.map((listing) => (
								<img
									key={listing.id}
									src={listing.image}
									alt="Previous listing"
									className="w-full h-32 object-cover rounded-lg"
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AddItem;
