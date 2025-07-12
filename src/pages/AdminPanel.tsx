import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const mockUsers = [
	{
		id: "1",
		name: "Alice Smith",
		email: "alice@example.com",
		avatar: "",
		role: "user",
	},
	{
		id: "2",
		name: "Bob Johnson",
		email: "bob@example.com",
		avatar: "",
		role: "user",
	},
	{
		id: "3",
		name: "Carol Lee",
		email: "carol@example.com",
		avatar: "",
		role: "admin",
	},
	{
		id: "4",
		name: "David Kim",
		email: "david@example.com",
		avatar: "",
		role: "user",
	},
];

const AdminPanel: React.FC = () => {
	const [tab, setTab] = useState("users");

	return (
		<div className="min-h-screen bg-background p-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle>Admin Panel</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs value={tab} onValueChange={setTab} className="w-full">
						<TabsList className="mb-6 w-full flex justify-between">
							<TabsTrigger value="users">Manage Users</TabsTrigger>
							<TabsTrigger value="orders">Manage Orders</TabsTrigger>
							<TabsTrigger value="listings">Manage Listings</TabsTrigger>
						</TabsList>
						<TabsContent value="users">
							<div className="space-y-4">
								{mockUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center bg-card rounded-lg p-4 shadow-sm"
									>
										<Avatar className="h-12 w-12 mr-4">
											{user.avatar ? (
												<AvatarImage src={user.avatar} alt={user.name} />
											) : (
												<AvatarFallback>
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											)}
										</Avatar>
										<div className="flex-1">
											<div className="font-semibold">{user.name}</div>
											<div className="text-sm text-muted-foreground">
												{user.email}
											</div>
											<div className="text-xs text-muted-foreground capitalize">
												{user.role}
											</div>
										</div>
										<div className="flex space-x-2">
											<Button size="sm" variant="outline">
												Action 1
											</Button>
											<Button size="sm" variant="secondary">
												Action 2
											</Button>
										</div>
									</div>
								))}
							</div>
						</TabsContent>
						<TabsContent value="orders">
							<div className="text-center text-muted-foreground">
								Order management coming soon.
							</div>
						</TabsContent>
						<TabsContent value="listings">
							<div className="text-center text-muted-foreground">
								Listing management coming soon.
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default AdminPanel;
