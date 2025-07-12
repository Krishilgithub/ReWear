import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Activity,
	Settings,
	Heart,
	ShoppingBag,
	Star,
	Edit,
	Save,
	X,
	Camera,
	Shield,
	Bell,
	Palette,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { userService } from "@/services/dataService";

interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone: string;
	location: string;
	bio: string;
	avatar: string;
	points: number;
	memberSince: string;
	totalSwaps: number;
	rating: number;
	itemsListed: number;
	itemsReceived: number;
}

const Profile = () => {
	const { user, logout } = useAuth();
	const { toast } = useToast();
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState<User | null>(null);
	const [editForm, setEditForm] = useState<User | null>(null);

	useEffect(() => {
		if (user?.id) {
			const loaded = userService.getById(user.id);
			setProfile(loaded);
			setEditForm(loaded);
		}
	}, [user]);

	const handleEdit = () => {
		setEditForm(profile);
		setIsEditing(true);
	};

	const handleSave = () => {
		if (editForm && user?.id) {
			const updated = userService.updateProfile(user.id, editForm);
			setProfile(updated);
			setEditForm(updated);
			setIsEditing(false);
			toast({
				title: "Profile updated",
				description: "Your profile has been successfully updated.",
			});
		}
	};

	const handleCancel = () => {
		setEditForm(profile);
		setIsEditing(false);
	};

	const handleInputChange = (field: keyof User, value: string) => {
		if (!editForm) return;
		setEditForm({
			...editForm,
			[field]: value,
		});
	};

	const handleProfilePictureUpdate = (image) => {
		if (user?.id && image) {
			const updated = userService.updateProfilePicture(user.id, image.url);
			setProfile(updated);
			setEditForm(updated);
		}
	};

	const recentActivity = [
		{
			id: 1,
			action: "Completed swap",
			item: "Vintage Denim Jacket",
			date: "2 hours ago",
			points: "+10",
		},
		{
			id: 2,
			action: "Listed item",
			item: "Floral Summer Dress",
			date: "1 day ago",
			points: "+5",
		},
		{
			id: 3,
			action: "Received 5-star rating",
			item: "Cashmere Sweater",
			date: "3 days ago",
			points: "+3",
		},
		{
			id: 4,
			action: "Completed swap",
			item: "Designer Sneakers",
			date: "1 week ago",
			points: "+10",
		},
	];

	const stats = [
		{
			label: "Total Points",
			value: profile.points,
			icon: Star,
			color: "text-yellow-500",
		},
		{
			label: "Items Listed",
			value: profile.itemsListed,
			icon: ShoppingBag,
			color: "text-blue-500",
		},
		{
			label: "Items Received",
			value: profile.itemsReceived,
			icon: Heart,
			color: "text-red-500",
		},
		{
			label: "Total Swaps",
			value: profile.totalSwaps,
			icon: Activity,
			color: "text-green-500",
		},
	];

	if (!user || !profile) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Profile</h1>
					<Button variant="outline" onClick={logout}>
						Sign out
					</Button>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Profile Overview */}
					<div className="lg:col-span-1">
						<Card>
							<CardHeader className="text-center">
								<div className="relative mx-auto mb-4">
									<ProfilePictureUpload
										currentPicture={profile.picture}
										onPictureSelected={handleProfilePictureUpdate}
										userName={profile.name}
									/>
								</div>
								<CardTitle className="text-xl">{profile.name}</CardTitle>
								<CardDescription>{profile.email}</CardDescription>
								<Badge variant="secondary" className="mt-2">
									{user.role}
								</Badge>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center space-x-2 text-sm">
									<MapPin className="w-4 h-4 text-muted-foreground" />
									<span>{profile.location}</span>
								</div>
								<div className="flex items-center space-x-2 text-sm">
									<Calendar className="w-4 h-4 text-muted-foreground" />
									<span>Member since {profile.memberSince}</span>
								</div>
								<div className="flex items-center space-x-2 text-sm">
									<Star className="w-4 h-4 text-yellow-500" />
									<span>{profile.rating} rating</span>
								</div>
								<Separator />
								<p className="text-sm text-muted-foreground">{profile.bio}</p>
							</CardContent>
						</Card>

						{/* Stats Cards */}
						<div className="grid grid-cols-2 gap-4 mt-6">
							{stats.map((stat, index) => {
								const Icon = stat.icon;
								return (
									<Card key={index}>
										<CardContent className="p-4 text-center">
											<Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
											<div className="text-2xl font-bold">{stat.value}</div>
											<div className="text-xs text-muted-foreground">
												{stat.label}
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2">
						<Tabs defaultValue="overview" className="space-y-6">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="activity">Activity</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
								<TabsTrigger value="preferences">Preferences</TabsTrigger>
							</TabsList>

							<TabsContent value="overview" className="space-y-6">
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle>Profile Information</CardTitle>
												<CardDescription>
													Manage your personal information
												</CardDescription>
											</div>
											{!isEditing ? (
												<Button
													variant="outline"
													size="sm"
													onClick={handleEdit}
												>
													<Edit className="w-4 h-4 mr-2" />
													Edit Profile
												</Button>
											) : (
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={handleCancel}
													>
														<X className="w-4 h-4 mr-2" />
														Cancel
													</Button>
													<Button size="sm" onClick={handleSave}>
														<Save className="w-4 h-4 mr-2" />
														Save
													</Button>
												</div>
											)}
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="name">Full Name</Label>
												<Input
													id="name"
													value={
														isEditing && editForm ? editForm.name : profile.name
													}
													onChange={(e) =>
														handleInputChange("name", e.target.value)
													}
													disabled={!isEditing}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email">Email</Label>
												<Input
													id="email"
													type="email"
													value={
														isEditing && editForm
															? editForm.email
															: profile.email
													}
													onChange={(e) =>
														handleInputChange("email", e.target.value)
													}
													disabled={!isEditing}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone">Phone</Label>
												<Input
													id="phone"
													value={
														isEditing && editForm
															? editForm.phone
															: profile.phone
													}
													onChange={(e) =>
														handleInputChange("phone", e.target.value)
													}
													disabled={!isEditing}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="location">Location</Label>
												<Input
													id="location"
													value={
														isEditing && editForm
															? editForm.location
															: profile.location
													}
													onChange={(e) =>
														handleInputChange("location", e.target.value)
													}
													disabled={!isEditing}
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="bio">Bio</Label>
											<Input
												id="bio"
												value={
													isEditing && editForm ? editForm.bio : profile.bio
												}
												onChange={(e) =>
													handleInputChange("bio", e.target.value)
												}
												disabled={!isEditing}
											/>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="activity" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Recent Activity</CardTitle>
										<CardDescription>
											Your recent actions and interactions
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{recentActivity.map((activity) => (
												<div
													key={activity.id}
													className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
												>
													<div className="flex items-center space-x-3">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														<div>
															<div className="font-medium">
																{activity.action}
															</div>
															<div className="text-sm text-muted-foreground">
																{activity.item}
															</div>
														</div>
													</div>
													<div className="text-right">
														<div className="text-sm font-medium text-green-600">
															{activity.points}
														</div>
														<div className="text-xs text-muted-foreground">
															{activity.date}
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="settings" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Account Settings</CardTitle>
										<CardDescription>
											Manage your account preferences and security
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<Shield className="w-5 h-5 text-muted-foreground" />
												<div>
													<div className="font-medium">
														Two-Factor Authentication
													</div>
													<div className="text-sm text-muted-foreground">
														Add an extra layer of security
													</div>
												</div>
											</div>
											<Button variant="outline" size="sm">
												Enable
											</Button>
										</div>
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<Bell className="w-5 h-5 text-muted-foreground" />
												<div>
													<div className="font-medium">Notifications</div>
													<div className="text-sm text-muted-foreground">
														Manage your notification preferences
													</div>
												</div>
											</div>
											<Button variant="outline" size="sm">
												Configure
											</Button>
										</div>
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<User className="w-5 h-5 text-muted-foreground" />
												<div>
													<div className="font-medium">Privacy Settings</div>
													<div className="text-sm text-muted-foreground">
														Control your privacy and data
													</div>
												</div>
											</div>
											<Button variant="outline" size="sm">
												Manage
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="preferences" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>App Preferences</CardTitle>
										<CardDescription>
											Customize your ReWear experience
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<Palette className="w-5 h-5 text-muted-foreground" />
												<div>
													<div className="font-medium">Theme</div>
													<div className="text-sm text-muted-foreground">
														Choose your preferred theme
													</div>
												</div>
											</div>
											<Button variant="outline" size="sm">
												Light
											</Button>
										</div>
										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-3">
												<MapPin className="w-5 h-5 text-muted-foreground" />
												<div>
													<div className="font-medium">Location Services</div>
													<div className="text-sm text-muted-foreground">
														Find items near you
													</div>
												</div>
											</div>
											<Button variant="outline" size="sm">
												Enable
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profile;
