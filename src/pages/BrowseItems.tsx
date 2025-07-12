import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
	Search,
	Filter,
	Grid3X3,
	List,
	MapPin,
	Star,
	Heart,
	Eye,
	ArrowLeft,
	SlidersHorizontal,
} from "lucide-react";
import {
	Item,
	ItemCategory,
	ItemType,
	ItemSize,
	ItemCondition,
	ItemStatus,
	SearchParams,
	SearchFilters,
} from "@/types";
import { itemsService, pointsService } from "@/services/dataService";

const BrowseItems = () => {
	const { user } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();
	const { trackEvent } = useAnalytics();
	const [searchParams, setSearchParams] = useSearchParams();

	// State
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(true);
	const [totalItems, setTotalItems] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);

	// Search and filter state
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<SearchFilters>({
		category: [],
		type: [],
		size: [],
		condition: [],
		minPoints: undefined,
		maxPoints: undefined,
		location: "",
		tags: [],
	});

	// Load items
	useEffect(() => {
		async function fetchItems() {
			setLoading(true);
			try {
				const dbItems = await itemsService.getAll();
				setItems(
					dbItems.filter(
						(item) => user?.role === "admin" || item.status === "available"
					)
				);
			} catch (e) {
				toast({
					title: "Failed to load items",
					description: e.message,
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		}
		fetchItems();
	}, [user]);

	// Handle search
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		loadItems();
		trackEvent("items_search", "browse", searchQuery);
	};

	// Handle filter changes
	const handleFilterChange = (key: keyof SearchFilters, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1);
	};

	// Clear all filters
	const clearFilters = () => {
		setFilters({
			category: [],
			type: [],
			size: [],
			condition: [],
			minPoints: undefined,
			maxPoints: undefined,
			location: "",
			tags: [],
		});
		setCurrentPage(1);
	};

	// Handle item click
	const handleItemClick = (item: Item) => {
		trackEvent("item_viewed", "items", item.category);
		navigate(`/item/${item.id}`);
	};

	// Handle swap request
	const handleSwapRequest = (item: Item) => {
		if (!user) {
			toast({
				title: "Authentication required",
				description: "Please sign in to request a swap.",
				variant: "destructive",
			});
			return;
		}

		if (user.id === item.userId) {
			toast({
				title: "Cannot swap your own item",
				description: "You cannot request a swap for your own item.",
				variant: "destructive",
			});
			return;
		}

		const userPoints = pointsService.getUserPoints(user.id);
		if (userPoints < item.points) {
			toast({
				title: "Insufficient points",
				description: `You need ${item.points} points to redeem this item. You have ${userPoints} points.`,
				variant: "destructive",
			});
			return;
		}

		navigate(`/item/${item.id}`, { state: { showSwapModal: true } });
	};

	// Render item card
	const renderItemCard = (item: Item) => (
		<Card
			key={item.id}
			className="cursor-pointer hover:shadow-lg transition-shadow"
			onClick={() => handleItemClick(item)}
		>
			<div className="relative">
				<img
					src={item.images[0]?.imageUrl || "/placeholder-item.jpg"}
					alt={item.title}
					className="w-full h-48 object-cover rounded-t-lg"
				/>
				<div className="absolute top-2 right-2">
					<Badge variant="secondary" className="bg-white/90 text-black">
						{item.points} pts
					</Badge>
				</div>
				<div className="absolute top-2 left-2">
					<Badge
						variant={
							item.status === ItemStatus.AVAILABLE ? "default" : "secondary"
						}
						className="bg-white/90 text-black"
					>
						{item.status}
					</Badge>
				</div>
			</div>

			<CardContent className="p-4">
				<div className="space-y-2">
					<h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{item.description}
					</p>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<MapPin className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								{item.location || "Location not specified"}
							</span>
						</div>
						<div className="flex items-center space-x-1">
							<Star className="h-4 w-4 text-yellow-500 fill-current" />
							<span className="text-sm">{item.condition}/5</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-1">
						{item.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
						{item.tags.length > 3 && (
							<Badge variant="outline" className="text-xs">
								+{item.tags.length - 3} more
							</Badge>
						)}
					</div>

					<div className="flex items-center justify-between pt-2">
						<div className="text-sm text-muted-foreground">
							by {item.user.name}
						</div>
						<Button
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								handleSwapRequest(item);
							}}
							disabled={!user || user.id === item.userId}
						>
							{pointsService.canAfford(user?.id || "", item.points)
								? "Swap"
								: "Need Points"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate("/dashboard")}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Dashboard
							</Button>
							<h1 className="text-2xl font-bold">Browse Items</h1>
						</div>

						<div className="flex items-center space-x-2">
							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("list")}
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				{/* Search and Filters */}
				<div className="mb-8 space-y-4">
					{/* Search Bar */}
					<form onSubmit={handleSearch} className="flex space-x-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search items by title, description, or tags..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button type="submit">
							<Search className="mr-2 h-4 w-4" />
							Search
						</Button>
					</form>

					{/* Filters */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Sheet open={showFilters} onOpenChange={setShowFilters}>
								<SheetTrigger asChild>
									<Button variant="outline" size="sm">
										<SlidersHorizontal className="mr-2 h-4 w-4" />
										Filters
									</Button>
								</SheetTrigger>
								<SheetContent>
									<SheetHeader>
										<SheetTitle>Filter Items</SheetTitle>
										<SheetDescription>
											Refine your search with these filters
										</SheetDescription>
									</SheetHeader>

									<div className="space-y-6 mt-6">
										{/* Category */}
										<div className="space-y-2">
											<Label>Category</Label>
											<Select
												onValueChange={(value) =>
													handleFilterChange(
														"category",
														value ? [value as ItemCategory] : []
													)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="All categories" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="">All categories</SelectItem>
													{Object.values(ItemCategory).map((category) => (
														<SelectItem key={category} value={category}>
															{category.charAt(0).toUpperCase() +
																category.slice(1)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Type */}
										<div className="space-y-2">
											<Label>Type</Label>
											<Select
												onValueChange={(value) =>
													handleFilterChange(
														"type",
														value ? [value as ItemType] : []
													)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="All types" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="">All types</SelectItem>
													{Object.values(ItemType).map((type) => (
														<SelectItem key={type} value={type}>
															{type.charAt(0).toUpperCase() + type.slice(1)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Size */}
										<div className="space-y-2">
											<Label>Size</Label>
											<Select
												onValueChange={(value) =>
													handleFilterChange(
														"size",
														value ? [value as ItemSize] : []
													)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="All sizes" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="">All sizes</SelectItem>
													{Object.values(ItemSize).map((size) => (
														<SelectItem key={size} value={size}>
															{size.toUpperCase()}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Condition */}
										<div className="space-y-2">
											<Label>Condition</Label>
											<Select
												onValueChange={(value) =>
													handleFilterChange(
														"condition",
														value ? [value as ItemCondition] : []
													)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="All conditions" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="">All conditions</SelectItem>
													{Object.values(ItemCondition).map((condition) => (
														<SelectItem key={condition} value={condition}>
															{condition.charAt(0).toUpperCase() +
																condition.slice(1)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										{/* Points Range */}
										<div className="space-y-2">
											<Label>Points Range</Label>
											<div className="grid grid-cols-2 gap-2">
												<Input
													placeholder="Min"
													type="number"
													onChange={(e) =>
														handleFilterChange(
															"minPoints",
															e.target.value
																? parseInt(e.target.value)
																: undefined
														)
													}
												/>
												<Input
													placeholder="Max"
													type="number"
													onChange={(e) =>
														handleFilterChange(
															"maxPoints",
															e.target.value
																? parseInt(e.target.value)
																: undefined
														)
													}
												/>
											</div>
										</div>

										{/* Location */}
										<div className="space-y-2">
											<Label>Location</Label>
											<Input
												placeholder="Enter location"
												onChange={(e) =>
													handleFilterChange("location", e.target.value)
												}
											/>
										</div>

										<div className="flex space-x-2">
											<Button
												onClick={clearFilters}
												variant="outline"
												className="flex-1"
											>
												Clear All
											</Button>
											<Button
												onClick={() => setShowFilters(false)}
												className="flex-1"
											>
												Apply Filters
											</Button>
										</div>
									</div>
								</SheetContent>
							</Sheet>

							<span className="text-sm text-muted-foreground">
								{totalItems} items found
							</span>
						</div>

						{user && (
							<Button onClick={() => navigate("/add-item")}>Add Item</Button>
						)}
					</div>
				</div>

				{/* Items Grid/List */}
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
							<p className="mt-2 text-muted-foreground">Loading items...</p>
						</div>
					</div>
				) : items.length === 0 ? (
					<div className="text-center py-12">
						<Search className="mx-auto h-12 w-12 text-muted-foreground" />
						<h3 className="mt-4 text-lg font-semibold">No items found</h3>
						<p className="text-muted-foreground">
							Try adjusting your search or filters to find what you're looking
							for.
						</p>
					</div>
				) : (
					<>
						<div
							className={
								viewMode === "grid"
									? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
									: "space-y-4"
							}
						>
							{items.map(renderItemCard)}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													setCurrentPage((prev) => Math.max(1, prev - 1))
												}
												className={
													currentPage === 1
														? "pointer-events-none opacity-50"
														: "cursor-pointer"
												}
											/>
										</PaginationItem>

										{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
											const page = i + 1;
											return (
												<PaginationItem key={page}>
													<PaginationLink
														onClick={() => setCurrentPage(page)}
														isActive={currentPage === page}
														className="cursor-pointer"
													>
														{page}
													</PaginationLink>
												</PaginationItem>
											);
										})}

										{totalPages > 5 && (
											<>
												<PaginationItem>
													<PaginationEllipsis />
												</PaginationItem>
												<PaginationItem>
													<PaginationLink
														onClick={() => setCurrentPage(totalPages)}
														isActive={currentPage === totalPages}
														className="cursor-pointer"
													>
														{totalPages}
													</PaginationLink>
												</PaginationItem>
											</>
										)}

										<PaginationItem>
											<PaginationNext
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(totalPages, prev + 1)
													)
												}
												className={
													currentPage === totalPages
														? "pointer-events-none opacity-50"
														: "cursor-pointer"
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
};

export default BrowseItems;
