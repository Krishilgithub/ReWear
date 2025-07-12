import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Notifications from "@/components/Notifications";
import {
	User,
	Mail,
	Calendar,
	Activity,
	LogOut,
	Plus,
	Package,
	Repeat as SwapIcon,
	Award,
	TrendingUp,
	MapPin,
	Star,
	Eye,
	MessageCircle,
	Settings,
	ShoppingBag,
	Heart,
} from "lucide-react";
import {
	Item,
	SwapRequest,
	Swap,
	PointsTransaction,
	ItemStatus,
	SwapRequestStatus,
	SwapMethod,
	PointsTransactionType,
} from "@/types";
import {
	itemsService,
	swapRequestsService,
	swapsService,
	pointsService,
	notificationsService,
	userService,
} from "@/services/dataService";
import { ImageUploadResult } from "@/services/imageService";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import TestNavigation from "@/components/TestNavigation";

const UserDashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	// State
	const [userItems, setUserItems] = useState<Item[]>([]);
	const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
	const [userSwaps, setUserSwaps] = useState<Swap[]>([]);
	const [pointsTransactions, setPointsTransactions] = useState<
		PointsTransaction[]
	>([]);
	const [userPoints, setUserPoints] = useState(0);
	const [profilePicture, setProfilePicture] =
		useState<ImageUploadResult | null>(null);
	const [stats, setStats] = useState({
		totalItems: 0,
		pendingItems: 0,
		activeSwaps: 0,
		completedSwaps: 0,
		totalPointsEarned: 0,
		totalPointsSpent: 0,
	});

	// Load user data
	useEffect(() => {
		if (user) {
			(async () => {
				await loadUserData();
			})();
		}
	}, [user]);

	const loadUserData = async () => {
		if (!user) return;

		const items = await itemsService.getByUserId(user.id);
		// If swapRequestsService and swapsService are async, await them as well, otherwise leave as is
		const requests = swapRequestsService.getByUserId(user.id);
		const swaps = swapsService
			.getAll()
			.filter((swap) => swap.ownerId === user.id || swap.swapperId === user.id);
		const transactions = pointsService.getTransactions(user.id);
		const points = pointsService.getUserPoints(user.id);

		setUserItems(items);
		setSwapRequests(requests);
		setUserSwaps(swaps);
		setPointsTransactions(transactions);
		setUserPoints(points);

		// Calculate stats
		const totalPointsEarned = transactions
			.filter((t) => t.amount > 0)
			.reduce((sum, t) => sum + t.amount, 0);
		const totalPointsSpent = transactions
			.filter((t) => t.amount < 0)
			.reduce((sum, t) => sum + Math.abs(t.amount), 0);

		setStats({
			totalItems: items.length,
			pendingItems: items.filter((item) => item.status === ItemStatus.PENDING)
				.length,
			activeSwaps: swaps.filter(
				(swap) => new Date(swap.completedAt) > new Date()
			).length,
			completedSwaps: swaps.filter(
				(swap) => new Date(swap.completedAt) <= new Date()
			).length,
			totalPointsEarned,
			totalPointsSpent,
		});
	};

	const handleProfilePictureUpdate = (image: ImageUploadResult | null) => {
		setProfilePicture(image);
		if (image && user) {
			// Update user profile in storage
			const updatedUser = userService.updateProfilePicture(user.id, image.url);
			if (updatedUser) {
				// Update the user context if needed
				console.log("Profile picture updated:", image.url);
			}
		}
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<div className="flex items-center space-x-4">
						<Notifications variant="dropdown" />
						<div className="flex items-center space-x-2">
							<Avatar>
								<AvatarImage
									src={profilePicture?.url || user.picture}
									alt={`${user.name}'s profile picture`}
								/>
								<AvatarFallback>
									{user.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className="font-medium">{user.name}</span>
						</div>
						<Button variant="outline" onClick={logout}>
							<LogOut className="mr-2 h-4 w-4" />
							Sign out
						</Button>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				{/* Stats Overview */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Award className="h-5 w-5 text-green-500" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Points Balance
									</p>
									<p className="text-2xl font-bold">{userPoints}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Package className="h-5 w-5 text-blue-500" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Items Listed
									</p>
									<p className="text-2xl font-bold">{stats.totalItems}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<SwapIcon className="h-5 w-5 text-purple-500" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Completed Swaps
									</p>
									<p className="text-2xl font-bold">{stats.completedSwaps}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<TrendingUp className="h-5 w-5 text-orange-500" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Points Earned
									</p>
									<p className="text-2xl font-bold">
										{stats.totalPointsEarned}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Dashboard Content */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="items">My Items</TabsTrigger>
						<TabsTrigger value="swaps">Swaps</TabsTrigger>
						<TabsTrigger value="points">Points</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							{/* Profile Information */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<User className="mr-2 h-5 w-5" />
										Profile Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<ProfilePictureUpload
										currentPicture={profilePicture?.url || user.picture}
										onPictureSelected={handleProfilePictureUpdate}
										userName={user.name}
									/>
									<Separator />
									<div className="flex items-center space-x-2">
										<Mail className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{user.email}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Badge
											variant={user.role === "admin" ? "default" : "secondary"}
										>
											{user.role}
										</Badge>
									</div>
									<Separator />
									<div className="flex items-center space-x-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											Member since {new Date().toLocaleDateString()}
										</span>
									</div>
								</CardContent>
							</Card>

							{/* Quick Actions */}
							<Card>
								<CardHeader>
									<CardTitle>Quick Actions</CardTitle>
									<CardDescription>Common tasks</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<Button
										variant="outline"
										className="w-full justify-start"
										onClick={() => navigate("/add-item")}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add New Item
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start"
										onClick={() => navigate("/browse")}
									>
										<ShoppingBag className="mr-2 h-4 w-4" />
										Browse Items
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start"
										onClick={() => navigate("/profile")}
									>
										<Settings className="mr-2 h-4 w-4" />
										Edit Profile
									</Button>
								</CardContent>
							</Card>

							{/* Test Navigation */}
							<Card>
								<CardHeader>
									<CardTitle>Debug Navigation</CardTitle>
									<CardDescription>
										Test navigation functionality
									</CardDescription>
								</CardHeader>
								<CardContent>
									<TestNavigation />
								</CardContent>
							</Card>
						</div>

						{/* Recent Activity */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Activity className="mr-2 h-5 w-5" />
									Recent Activity
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{pointsTransactions.slice(0, 5).map((transaction) => (
										<div
											key={transaction.id}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-3">
												<Award className="h-4 w-4 text-muted-foreground" />
												<div>
													<p className="text-sm font-medium">
														{transaction.description}
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(
															transaction.createdAt
														).toLocaleDateString()}
													</p>
												</div>
											</div>
											<Badge
												variant={
													transaction.amount > 0 ? "default" : "secondary"
												}
											>
												{transaction.amount > 0 ? "+" : ""}
												{transaction.amount} pts
											</Badge>
										</div>
									))}
									{pointsTransactions.length === 0 && (
										<p className="text-sm text-muted-foreground text-center py-4">
											No recent activity
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* My Items Tab */}
					<TabsContent value="items" className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold">My Items</h2>
							<Button onClick={() => navigate("/add-item")}>
								<Plus className="mr-2 h-4 w-4" />
								Add Item
							</Button>
						</div>

						{userItems.length === 0 ? (
							<Card>
								<CardContent className="text-center py-12">
									<Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
									<h3 className="text-lg font-semibold mb-2">No items yet</h3>
									<p className="text-muted-foreground mb-4">
										Start by adding your first item to the community!
									</p>
									<Button onClick={() => navigate("/add-item")}>
										<Plus className="mr-2 h-4 w-4" />
										Add Your First Item
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{userItems.map((item) => (
									<Card
										key={item.id}
										className="cursor-pointer hover:shadow-lg transition-shadow"
									>
										<div className="relative">
											<img
												src={
													item.images[0]?.imageUrl || "/placeholder-item.jpg"
												}
												alt={item.title}
												className="w-full h-48 object-cover rounded-t-lg"
											/>
											<Badge
												variant={
													item.status === ItemStatus.AVAILABLE
														? "default"
														: "secondary"
												}
												className="absolute top-2 right-2"
											>
												{item.status}
											</Badge>
										</div>
										<CardContent className="p-4">
											<h3 className="font-semibold text-lg mb-2">
												{item.title}
											</h3>
											<div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
												<div className="flex items-center space-x-1">
													<Star className="h-4 w-4" />
													<span>{item.condition}/5</span>
												</div>
												<div className="flex items-center space-x-1">
													<Award className="h-4 w-4" />
													<span>{item.points} pts</span>
												</div>
											</div>
											<div className="flex space-x-2">
												<Button
													variant="outline"
													size="sm"
													className="flex-1"
													onClick={() => navigate(`/item/${item.id}`)}
												>
													<Eye className="mr-1 h-3 w-3" />
													View
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="flex-1"
													onClick={() => navigate(`/edit-item/${item.id}`)}
												>
													<Settings className="mr-1 h-3 w-3" />
													Edit
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</TabsContent>

					{/* Swaps Tab */}
					<TabsContent value="swaps" className="space-y-6">
						<h2 className="text-2xl font-bold">Swaps</h2>

						{/* Swap Requests */}
						<Card>
							<CardHeader>
								<CardTitle>Pending Swap Requests</CardTitle>
							</CardHeader>
							<CardContent>
								{swapRequests.filter(
									(req) => req.status === SwapRequestStatus.PENDING
								).length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-4">
										No pending swap requests
									</p>
								) : (
									<div className="space-y-4">
										{swapRequests
											.filter((req) => req.status === SwapRequestStatus.PENDING)
											.map((request) => (
												<div
													key={request.id}
													className="flex items-center justify-between p-4 border rounded-lg"
												>
													<div className="flex items-center space-x-3">
														<img
															src={
																request.item.images[0]?.imageUrl ||
																"/placeholder-item.jpg"
															}
															alt={request.item.title}
															className="w-12 h-12 object-cover rounded"
														/>
														<div>
															<p className="font-medium">
																{request.item.title}
															</p>
															<p className="text-sm text-muted-foreground">
																Requested by {request.requester.name}
															</p>
														</div>
													</div>
													<div className="flex space-x-2">
														<Button
															size="sm"
															onClick={() => {
																swapRequestsService.updateStatus(
																	request.id,
																	SwapRequestStatus.ACCEPTED
																);
																loadUserData();
															}}
														>
															Accept
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => {
																swapRequestsService.updateStatus(
																	request.id,
																	SwapRequestStatus.REJECTED
																);
																loadUserData();
															}}
														>
															Reject
														</Button>
													</div>
												</div>
											))}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Completed Swaps */}
						<Card>
							<CardHeader>
								<CardTitle>Completed Swaps</CardTitle>
							</CardHeader>
							<CardContent>
								{userSwaps.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-4">
										No completed swaps yet
									</p>
								) : (
									<div className="space-y-4">
										{userSwaps.map((swap) => (
											<div
												key={swap.id}
												className="flex items-center justify-between p-4 border rounded-lg"
											>
												<div className="flex items-center space-x-3">
													<img
														src={
															swap.item.images[0]?.imageUrl ||
															"/placeholder-item.jpg"
														}
														alt={swap.item.title}
														className="w-12 h-12 object-cover rounded"
													/>
													<div>
														<p className="font-medium">{swap.item.title}</p>
														<p className="text-sm text-muted-foreground">
															{swap.method === SwapMethod.SWAP
																? "Item Swap"
																: "Points Redemption"}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="text-sm font-medium">
														{swap.ownerId === user.id
															? "Given to"
															: "Received from"}
													</p>
													<p className="text-sm text-muted-foreground">
														{swap.ownerId === user.id
															? swap.swapper.name
															: swap.owner.name}
													</p>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Points Tab */}
					<TabsContent value="points" className="space-y-6">
						<h2 className="text-2xl font-bold">Points & Rewards</h2>

						{/* Points Overview */}
						<div className="grid gap-4 md:grid-cols-3">
							<Card>
								<CardContent className="p-6 text-center">
									<Award className="mx-auto h-8 w-8 text-green-500 mb-2" />
									<p className="text-2xl font-bold">{userPoints}</p>
									<p className="text-sm text-muted-foreground">
										Current Balance
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 text-center">
									<TrendingUp className="mx-auto h-8 w-8 text-blue-500 mb-2" />
									<p className="text-2xl font-bold">
										{stats.totalPointsEarned}
									</p>
									<p className="text-sm text-muted-foreground">Total Earned</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 text-center">
									<ShoppingBag className="mx-auto h-8 w-8 text-orange-500 mb-2" />
									<p className="text-2xl font-bold">{stats.totalPointsSpent}</p>
									<p className="text-sm text-muted-foreground">Total Spent</p>
								</CardContent>
							</Card>
						</div>

						{/* Points History */}
						<Card>
							<CardHeader>
								<CardTitle>Points History</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{pointsTransactions.map((transaction) => (
										<div
											key={transaction.id}
											className="flex items-center justify-between p-4 border rounded-lg"
										>
											<div className="flex items-center space-x-3">
												<Award
													className={`h-5 w-5 ${
														transaction.amount > 0
															? "text-green-500"
															: "text-orange-500"
													}`}
												/>
												<div>
													<p className="font-medium">
														{transaction.description}
													</p>
													<p className="text-sm text-muted-foreground">
														{new Date(
															transaction.createdAt
														).toLocaleDateString()}
													</p>
												</div>
											</div>
											<Badge
												variant={
													transaction.amount > 0 ? "default" : "secondary"
												}
											>
												{transaction.amount > 0 ? "+" : ""}
												{transaction.amount} pts
											</Badge>
										</div>
									))}
									{pointsTransactions.length === 0 && (
										<p className="text-sm text-muted-foreground text-center py-4">
											No points transactions yet
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Activity Tab */}
					<TabsContent value="activity" className="space-y-6">
						<h2 className="text-2xl font-bold">Activity Feed</h2>

						<Card>
							<CardContent className="p-6">
								<div className="space-y-6">
									{pointsTransactions.map((transaction) => (
										<div
											key={transaction.id}
											className="flex items-start space-x-4"
										>
											<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
											<div className="flex-1">
												<p className="font-medium">{transaction.description}</p>
												<p className="text-sm text-muted-foreground">
													{new Date(transaction.createdAt).toLocaleString()}
												</p>
											</div>
											<Badge
												variant={
													transaction.amount > 0 ? "default" : "secondary"
												}
											>
												{transaction.amount > 0 ? "+" : ""}
												{transaction.amount} pts
											</Badge>
										</div>
									))}
									{pointsTransactions.length === 0 && (
										<div className="text-center py-8">
											<Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No activity yet
											</h3>
											<p className="text-muted-foreground">
												Start using the platform to see your activity here!
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};

export default UserDashboard;
