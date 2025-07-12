import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
	Bell,
	Check,
	Trash2,
	MessageCircle,
	Repeat,
	Award,
	AlertCircle,
	Settings,
} from "lucide-react";
import { Notification, NotificationType } from "@/types";
import { notificationsService } from "@/services/dataService";

interface NotificationsProps {
	variant?: "dropdown" | "sheet";
}

const Notifications: React.FC<NotificationsProps> = ({
	variant = "dropdown",
}) => {
	const { user } = useAuth();
	const { toast } = useToast();

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [showAll, setShowAll] = useState(false);

	// Load notifications
	useEffect(() => {
		if (user) {
			loadNotifications();
		}
	}, [user]);

	const loadNotifications = () => {
		if (!user) return;

		const userNotifications = notificationsService.getByUserId(user.id);
		setNotifications(userNotifications);
		setUnreadCount(notificationsService.getUnreadCount(user.id));
	};

	// Mark notification as read
	const markAsRead = (notificationId: string) => {
		notificationsService.markAsRead(notificationId);
		loadNotifications();
	};

	// Mark all as read
	const markAllAsRead = () => {
		if (!user) return;

		notificationsService.markAllAsRead(user.id);
		loadNotifications();

		toast({
			title: "All notifications marked as read",
			description: "You're all caught up!",
		});
	};

	// Delete notification
	const deleteNotification = (notificationId: string) => {
		notificationsService.delete(notificationId);
		loadNotifications();

		toast({
			title: "Notification deleted",
			description: "The notification has been removed.",
		});
	};

	// Get notification icon
	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.SWAP_REQUEST:
				return <Repeat className="h-4 w-4 text-blue-500" />;
			case NotificationType.SWAP_ACCEPTED:
				return <Check className="h-4 w-4 text-green-500" />;
			case NotificationType.SWAP_REJECTED:
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			case NotificationType.ITEM_APPROVED:
				return <Check className="h-4 w-4 text-green-500" />;
			case NotificationType.ITEM_REJECTED:
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			case NotificationType.POINTS_EARNED:
				return <Award className="h-4 w-4 text-yellow-500" />;
			case NotificationType.POINTS_SPENT:
				return <Award className="h-4 w-4 text-orange-500" />;
			case NotificationType.SYSTEM:
				return <Settings className="h-4 w-4 text-gray-500" />;
			default:
				return <Bell className="h-4 w-4 text-gray-500" />;
		}
	};

	// Get notification color
	const getNotificationColor = (type: NotificationType) => {
		switch (type) {
			case NotificationType.SWAP_ACCEPTED:
			case NotificationType.ITEM_APPROVED:
			case NotificationType.POINTS_EARNED:
				return "border-l-green-500";
			case NotificationType.SWAP_REJECTED:
			case NotificationType.ITEM_REJECTED:
				return "border-l-red-500";
			case NotificationType.SWAP_REQUEST:
				return "border-l-blue-500";
			case NotificationType.POINTS_SPENT:
				return "border-l-orange-500";
			default:
				return "border-l-gray-500";
		}
	};

	// Format timestamp
	const formatTimestamp = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return date.toLocaleDateString();
	};

	// Render notification item
	const renderNotification = (notification: Notification) => (
		<div
			key={notification.id}
			className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
				!notification.isRead ? "bg-muted/50" : ""
			} hover:bg-muted/30 transition-colors`}
		>
			<div className="flex items-start justify-between">
				<div className="flex items-start space-x-3 flex-1">
					<div className="mt-1">{getNotificationIcon(notification.type)}</div>
					<div className="flex-1 min-w-0">
						<h4
							className={`text-sm font-medium ${
								!notification.isRead
									? "text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{notification.title}
						</h4>
						<p className="text-sm text-muted-foreground mt-1">
							{notification.message}
						</p>
						<p className="text-xs text-muted-foreground mt-2">
							{formatTimestamp(notification.createdAt)}
						</p>
					</div>
				</div>

				<div className="flex items-center space-x-1 ml-2">
					{!notification.isRead && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => markAsRead(notification.id)}
							className="h-6 w-6 p-0"
						>
							<Check className="h-3 w-3" />
						</Button>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => deleteNotification(notification.id)}
						className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			</div>
		</div>
	);

	// Dropdown variant
	if (variant === "dropdown") {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="relative">
						<Bell className="h-5 w-5" />
						{unreadCount > 0 && (
							<Badge
								variant="destructive"
								className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
							>
								{unreadCount > 99 ? "99+" : unreadCount}
							</Badge>
						)}
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-80">
					<DropdownMenuLabel className="flex items-center justify-between">
						<span>Notifications</span>
						{unreadCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={markAllAsRead}
								className="h-6 text-xs"
							>
								Mark all read
							</Button>
						)}
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<ScrollArea className="h-64">
						{notifications.length === 0 ? (
							<div className="p-4 text-center text-muted-foreground">
								<Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
								<p className="text-sm">No notifications yet</p>
							</div>
						) : (
							<div className="space-y-1">
								{notifications.slice(0, 5).map(renderNotification)}
								{notifications.length > 5 && (
									<div className="p-2 text-center">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowAll(true)}
											className="text-xs"
										>
											View all {notifications.length} notifications
										</Button>
									</div>
								)}
							</div>
						)}
					</ScrollArea>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// Sheet variant
	return (
		<Sheet open={showAll} onOpenChange={setShowAll}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="sm" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
						>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</SheetTrigger>

			<SheetContent>
				<SheetHeader>
					<SheetTitle className="flex items-center justify-between">
						<span>All Notifications</span>
						{unreadCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={markAllAsRead}
								className="h-8 text-xs"
							>
								Mark all read
							</Button>
						)}
					</SheetTitle>
					<SheetDescription>
						{unreadCount > 0
							? `${unreadCount} unread notifications`
							: "All caught up!"}
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-full mt-6">
					{notifications.length === 0 ? (
						<div className="text-center py-12">
							<Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No notifications</h3>
							<p className="text-muted-foreground">
								You're all caught up! New notifications will appear here.
							</p>
						</div>
					) : (
						<div className="space-y-1">
							{notifications.map((notification, index) => (
								<div key={notification.id}>
									{renderNotification(notification)}
									{index < notifications.length - 1 && <Separator />}
								</div>
							))}
						</div>
					)}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

export default Notifications;
