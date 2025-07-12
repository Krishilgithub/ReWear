import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
	ArrowLeft,
	MapPin,
	Star,
	Heart,
	Share2,
	MessageCircle,
	Send,
	ChevronLeft,
	ChevronRight,
	Calendar,
	User,
	Tag,
	Award,
} from "lucide-react";
import {
	Item,
	ItemStatus,
	SwapRequest,
	SwapRequestStatus,
	SwapMethod,
} from "@/types";
import {
	itemsService,
	swapRequestsService,
	pointsService,
	notificationsService,
} from "@/services/dataService";

const ItemDetail = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const { toast } = useToast();
	const { trackEvent } = useAnalytics();

	// State
	const [item, setItem] = useState<Item | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [showSwapModal, setShowSwapModal] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [swapMessage, setSwapMessage] = useState("");
	const [swapLoading, setSwapLoading] = useState(false);
	const [chatMessages, setChatMessages] = useState<
		Array<{
			id: string;
			sender: string;
			message: string;
			timestamp: string;
		}>
	>([]);
	const [newMessage, setNewMessage] = useState("");

	// Check if swap modal should be shown from navigation state
	useEffect(() => {
		if (location.state?.showSwapModal) {
			setShowSwapModal(true);
		}
	}, [location.state]);

	// Load item data
	useEffect(() => {
		if (id) {
			loadItem();
		}
	}, [id]);

	const loadItem = () => {
		if (!id) return;

		const itemData = itemsService.getById(id);
		if (itemData) {
			setItem(itemData);
			trackEvent("item_detail_viewed", "items", itemData.category);
		} else {
			toast({
				title: "Item not found",
				description: "The item you're looking for doesn't exist.",
				variant: "destructive",
			});
			navigate("/browse");
		}
		setLoading(false);
	};

	// Image gallery navigation
	const nextImage = () => {
		if (item && currentImageIndex < item.images.length - 1) {
			setCurrentImageIndex(currentImageIndex + 1);
		}
	};

	const prevImage = () => {
		if (currentImageIndex > 0) {
			setCurrentImageIndex(currentImageIndex - 1);
		}
	};

	// Handle swap request
	const handleSwapRequest = async () => {
		if (!user || !item) return;

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

		setSwapLoading(true);

		try {
			const swapRequest = swapRequestsService.create(
				item.id,
				user.id,
				user.name,
				swapMessage
			);

			trackEvent("swap_request_sent", "swaps", item.category);

			toast({
				title: "Swap request sent!",
				description: "The item owner will be notified of your request.",
			});

			setShowSwapModal(false);
			setSwapMessage("");
		} catch (error) {
			toast({
				title: "Failed to send swap request",
				description: "Please try again.",
				variant: "destructive",
			});
		} finally {
			setSwapLoading(false);
		}
	};

	// Handle chat message
	const sendMessage = () => {
		if (!newMessage.trim() || !user) return;

		const message = {
			id: Date.now().toString(),
			sender: user.name,
			message: newMessage,
			timestamp: new Date().toISOString(),
		};

		setChatMessages((prev) => [...prev, message]);
		setNewMessage("");
	};

	// Get condition text
	const getConditionText = (condition: number) => {
		switch (condition) {
			case 1:
				return "Poor";
			case 2:
				return "Fair";
			case 3:
				return "Good";
			case 4:
				return "Excellent";
			case 5:
				return "Like New";
			default:
				return "Unknown";
		}
	};

	// Get status badge variant
	const getStatusBadgeVariant = (status: ItemStatus) => {
		switch (status) {
			case ItemStatus.AVAILABLE:
				return "default";
			case ItemStatus.PENDING:
				return "secondary";
			case ItemStatus.SWAPPED:
				return "destructive";
			case ItemStatus.REJECTED:
				return "destructive";
			default:
				return "secondary";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex justify-center items-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="mt-2 text-muted-foreground">Loading item...</p>
				</div>
			</div>
		);
	}

	if (!item) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate("/browse")}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Browse
							</Button>
							<h1 className="text-2xl font-bold">{item.title}</h1>
						</div>

						<div className="flex items-center space-x-2">
							<Button variant="outline" size="sm">
								<Share2 className="mr-2 h-4 w-4" />
								Share
							</Button>
							<Button variant="outline" size="sm">
								<Heart className="mr-2 h-4 w-4" />
								Save
							</Button>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Image Gallery */}
					<div className="space-y-4">
						<div className="relative">
							<img
								src={
									item.images[currentImageIndex]?.imageUrl ||
									"/placeholder-item.jpg"
								}
								alt={item.title}
								className="w-full h-96 object-cover rounded-lg"
							/>

							{/* Image Navigation */}
							{item.images.length > 1 && (
								<>
									<Button
										variant="outline"
										size="sm"
										className="absolute left-2 top-1/2 transform -translate-y-1/2"
										onClick={prevImage}
										disabled={currentImageIndex === 0}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="absolute right-2 top-1/2 transform -translate-y-1/2"
										onClick={nextImage}
										disabled={currentImageIndex === item.images.length - 1}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</>
							)}

							{/* Image Counter */}
							<div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
								{currentImageIndex + 1} / {item.images.length}
							</div>
						</div>

						{/* Thumbnail Gallery */}
						{item.images.length > 1 && (
							<div className="flex space-x-2 overflow-x-auto">
								{item.images.map((image, index) => (
									<button
										key={image.id}
										onClick={() => setCurrentImageIndex(index)}
										className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
											index === currentImageIndex
												? "border-primary"
												: "border-gray-300"
										}`}
									>
										<img
											src={image.imageUrl}
											alt={`${item.title} ${index + 1}`}
											className="w-full h-full object-cover rounded"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Item Information */}
					<div className="space-y-6">
						{/* Basic Info */}
						<div className="space-y-4">
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-3xl font-bold">{item.title}</h1>
									<p className="text-lg text-muted-foreground mt-2">
										{item.description}
									</p>
								</div>
								<Badge variant={getStatusBadgeVariant(item.status)}>
									{item.status}
								</Badge>
							</div>

							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-1">
									<Star className="h-5 w-5 text-yellow-500 fill-current" />
									<span className="font-semibold">{item.condition}/5</span>
									<span className="text-muted-foreground">
										({getConditionText(item.condition)})
									</span>
								</div>
								<div className="flex items-center space-x-1">
									<Award className="h-5 w-5 text-green-500" />
									<span className="font-semibold text-green-600">
										{item.points} points
									</span>
								</div>
							</div>
						</div>

						<Separator />

						{/* Item Details */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Item Details</h3>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label className="text-sm text-muted-foreground">
										Category
									</Label>
									<p className="font-medium">{item.category}</p>
								</div>
								<div>
									<Label className="text-sm text-muted-foreground">Type</Label>
									<p className="font-medium">{item.type}</p>
								</div>
								<div>
									<Label className="text-sm text-muted-foreground">Size</Label>
									<p className="font-medium">{item.size.toUpperCase()}</p>
								</div>
								<div>
									<Label className="text-sm text-muted-foreground">
										Condition
									</Label>
									<p className="font-medium">
										{getConditionText(item.condition)}
									</p>
								</div>
							</div>

							{item.location && (
								<div className="flex items-center space-x-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										{item.location}
									</span>
								</div>
							)}
						</div>

						<Separator />

						{/* Tags */}
						<div className="space-y-2">
							<Label className="text-sm text-muted-foreground">Tags</Label>
							<div className="flex flex-wrap gap-2">
								{item.tags.map((tag) => (
									<Badge key={tag} variant="outline">
										{tag}
									</Badge>
								))}
							</div>
						</div>

						<Separator />

						{/* Owner Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Listed by</h3>

							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarFallback>
										{item.user.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{item.user.name}</p>
									<p className="text-sm text-muted-foreground">
										Member since {new Date(item.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>

						<Separator />

						{/* Action Buttons */}
						<div className="space-y-3">
							{user &&
								user.id !== item.userId &&
								item.status === ItemStatus.AVAILABLE && (
									<div className="space-y-2">
										<Button
											className="w-full"
											size="lg"
											onClick={() => setShowSwapModal(true)}
											disabled={!pointsService.canAfford(user.id, item.points)}
										>
											{pointsService.canAfford(user.id, item.points)
												? `Request Swap (${item.points} points)`
												: `Need ${
														item.points - pointsService.getUserPoints(user.id)
												  } more points`}
										</Button>

										<Button
											variant="outline"
											className="w-full"
											onClick={() => setShowChat(true)}
										>
											<MessageCircle className="mr-2 h-4 w-4" />
											Chat with Owner
										</Button>
									</div>
								)}

							{user?.role === "admin" && item.status === ItemStatus.PENDING && (
								<div className="space-y-2">
									<Button
										className="w-full"
										variant="default"
										onClick={() => {
											itemsService.update(item.id, {
												status: ItemStatus.AVAILABLE,
											});
											loadItem();
											toast({
												title: "Item approved",
												description: "The item is now available for swaps.",
											});
										}}
									>
										Approve Item
									</Button>
									<Button
										className="w-full"
										variant="destructive"
										onClick={() => {
											itemsService.update(item.id, {
												status: ItemStatus.REJECTED,
											});
											loadItem();
											toast({
												title: "Item rejected",
												description: "The item has been rejected.",
											});
										}}
									>
										Reject Item
									</Button>
								</div>
							)}

							{user && user.id === item.userId && (
								<div className="space-y-2">
									<Button
										variant="outline"
										className="w-full"
										onClick={() => navigate(`/edit-item/${item.id}`)}
									>
										Edit Item
									</Button>
									<Button
										variant="destructive"
										className="w-full"
										onClick={() => {
											if (
												confirm("Are you sure you want to delete this item?")
											) {
												itemsService.delete(item.id);
												navigate("/dashboard");
												toast({
													title: "Item deleted",
													description: "Your item has been removed.",
												});
											}
										}}
									>
										Delete Item
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>

			{/* Swap Request Modal */}
			<Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Request Swap</DialogTitle>
						<DialogDescription>
							Send a swap request for "{item.title}". This will cost you{" "}
							{item.points} points.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="message">Message (Optional)</Label>
							<Textarea
								id="message"
								placeholder="Tell the owner why you'd like to swap for this item..."
								value={swapMessage}
								onChange={(e) => setSwapMessage(e.target.value)}
								rows={4}
							/>
						</div>

						<div className="bg-muted p-4 rounded-lg">
							<p className="text-sm text-muted-foreground">
								<strong>Your points:</strong>{" "}
								{pointsService.getUserPoints(user?.id || "")}
							</p>
							<p className="text-sm text-muted-foreground">
								<strong>Required points:</strong> {item.points}
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowSwapModal(false)}>
							Cancel
						</Button>
						<Button onClick={handleSwapRequest} disabled={swapLoading}>
							{swapLoading ? "Sending..." : "Send Request"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Chat Sheet */}
			<Sheet open={showChat} onOpenChange={setShowChat}>
				<SheetContent className="w-96">
					<SheetHeader>
						<SheetTitle>Chat with {item.user.name}</SheetTitle>
						<SheetDescription>
							Discuss the swap details with the item owner.
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-col h-full mt-4">
						{/* Messages */}
						<div className="flex-1 space-y-4 overflow-y-auto mb-4">
							{chatMessages.length === 0 ? (
								<div className="text-center text-muted-foreground">
									<MessageCircle className="mx-auto h-8 w-8 mb-2" />
									<p>No messages yet. Start the conversation!</p>
								</div>
							) : (
								chatMessages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === user?.name
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-xs px-3 py-2 rounded-lg ${
												message.sender === user?.name
													? "bg-primary text-primary-foreground"
													: "bg-muted"
											}`}
										>
											<p className="text-sm">{message.message}</p>
											<p className="text-xs opacity-70 mt-1">
												{new Date(message.timestamp).toLocaleTimeString()}
											</p>
										</div>
									</div>
								))
							)}
						</div>

						{/* Message Input */}
						<div className="flex space-x-2">
							<Input
								placeholder="Type your message..."
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && sendMessage()}
							/>
							<Button size="sm" onClick={sendMessage}>
								<Send className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default ItemDetail;
