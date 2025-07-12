import {
	Item,
	SwapRequest,
	Swap,
	Notification,
	PointsTransaction,
	CreateItemForm,
	SearchParams,
	SearchFilters,
	PaginatedResponse,
	ItemStatus,
	SwapRequestStatus,
	SwapMethod,
	PointsTransactionType,
	NotificationType,
} from "@/types";

// Local Storage Keys
const STORAGE_KEYS = {
	ITEMS: "rewear_items",
	SWAP_REQUESTS: "rewear_swap_requests",
	SWAPS: "rewear_swaps",
	NOTIFICATIONS: "rewear_notifications",
	POINTS_TRANSACTIONS: "rewear_points_transactions",
	USER_POINTS: "rewear_user_points",
	USERS: "rewear_users",
};

// Helper functions for localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.error(`Error reading from localStorage (${key}):`, error);
		return defaultValue;
	}
};

const saveToStorage = <T>(key: string, value: T): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Error saving to localStorage (${key}):`, error);
	}
};

// Generate unique IDs
const generateId = (): string => {
	return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Items Service
export const itemsService = {
	getAll: async (): Promise<Item[]> => {
		let items = getFromStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
		if (!items || items.length === 0) {
			seedSampleItems();
			items = getFromStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
		}
		return items;
	},

	getById: async (id: string): Promise<Item | null> => {
		const items = await itemsService.getAll();
		return items.find((item) => item.id === id) || null;
	},

	getByUserId: async (userId: string): Promise<Item[]> => {
		const items = await itemsService.getAll();
		return items.filter((item) => item.userId === userId);
	},

	create: async (
		itemData: CreateItemForm,
		userId: string,
		userName: string
	): Promise<Item> => {
		const items = getFromStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
		const newItem: Item = {
			id: generateId(),
			...itemData,
			userId,
			user: { id: userId, name: userName, email: "", role: "user" },
			status: "available",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			images: itemData.images.map((img, idx) => ({
				id: generateId(),
				imageUrl: img.url,
				publicId: img.publicId,
				itemId: "", // will be set after creation
				isPrimary: idx === 0,
			})),
			swapRequests: [],
		};
		// Set itemId for images
		newItem.images = newItem.images.map((img) => ({
			...img,
			itemId: newItem.id,
		}));
		items.push(newItem);
		saveToStorage(STORAGE_KEYS.ITEMS, items);
		return newItem;
	},

	update: (id: string, updates: Partial<Item>): Item | null => {
		const items = getFromStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
		const index = items.findIndex((item) => item.id === id);

		if (index === -1) return null;

		items[index] = {
			...items[index],
			...updates,
			updatedAt: new Date().toISOString(),
		};

		saveToStorage(STORAGE_KEYS.ITEMS, items);
		return items[index];
	},

	delete: (id: string): boolean => {
		const items = getFromStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
		const filteredItems = items.filter((item) => item.id !== id);

		if (filteredItems.length === items.length) return false;

		saveToStorage(STORAGE_KEYS.ITEMS, filteredItems);
		return true;
	},

	search: (params: SearchParams): PaginatedResponse<Item> => {
		let items = getFromStorage<Item[]>(STORAGE_KEYS.ITEMS, []);

		// Apply search query
		if (params.query) {
			const query = params.query.toLowerCase();
			items = items.filter(
				(item) =>
					item.title.toLowerCase().includes(query) ||
					item.description.toLowerCase().includes(query) ||
					item.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Apply filters
		if (params.filters) {
			const filters = params.filters;

			if (filters.category?.length) {
				items = items.filter((item) =>
					filters.category!.includes(item.category)
				);
			}

			if (filters.type?.length) {
				items = items.filter((item) => filters.type!.includes(item.type));
			}

			if (filters.size?.length) {
				items = items.filter((item) => filters.size!.includes(item.size));
			}

			if (filters.condition?.length) {
				items = items.filter((item) =>
					filters.condition!.includes(item.condition)
				);
			}

			if (filters.minPoints !== undefined) {
				items = items.filter((item) => item.points >= filters.minPoints!);
			}

			if (filters.maxPoints !== undefined) {
				items = items.filter((item) => item.points <= filters.maxPoints!);
			}

			if (filters.location) {
				items = items.filter((item) =>
					item.location?.toLowerCase().includes(filters.location!.toLowerCase())
				);
			}
		}

		// Apply sorting
		if (params.sortBy) {
			items.sort((a, b) => {
				let aValue: any = a[params.sortBy!];
				let bValue: any = b[params.sortBy!];

				if (params.sortBy === "createdAt") {
					aValue = new Date(aValue).getTime();
					bValue = new Date(bValue).getTime();
				}

				if (params.sortOrder === "desc") {
					return bValue > aValue ? 1 : -1;
				}
				return aValue > bValue ? 1 : -1;
			});
		}

		// Apply pagination
		const page = params.page || 1;
		const limit = params.limit || 12;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedItems = items.slice(startIndex, endIndex);

		return {
			items: paginatedItems,
			total: items.length,
			page,
			limit,
			totalPages: Math.ceil(items.length / limit),
		};
	},
};

// Swap Requests Service
export const swapRequestsService = {
	getAll: (): SwapRequest[] => {
		return getFromStorage<SwapRequest[]>(STORAGE_KEYS.SWAP_REQUESTS, []);
	},

	getById: (id: string): SwapRequest | null => {
		const requests = swapRequestsService.getAll();
		return requests.find((request) => request.id === id) || null;
	},

	getByUserId: (userId: string): SwapRequest[] => {
		const requests = swapRequestsService.getAll();
		return requests.filter((request) => request.requesterId === userId);
	},

	getByItemId: (itemId: string): SwapRequest[] => {
		const requests = swapRequestsService.getAll();
		return requests.filter((request) => request.itemId === itemId);
	},

	create: (
		itemId: string,
		requesterId: string,
		requesterName: string,
		message?: string
	): SwapRequest => {
		const requests = swapRequestsService.getAll();
		const item = itemsService.getById(itemId);

		if (!item) throw new Error("Item not found");

		const newRequest: SwapRequest = {
			id: generateId(),
			status: SwapRequestStatus.PENDING,
			message,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			itemId,
			item,
			requesterId,
			requester: {
				id: requesterId,
				name: requesterName,
				email: "",
				role: "user",
			},
		};

		requests.push(newRequest);
		saveToStorage(STORAGE_KEYS.SWAP_REQUESTS, requests);

		// Create notification for item owner
		notificationsService.create({
			userId: item.userId,
			type: NotificationType.SWAP_REQUEST,
			title: "New Swap Request",
			message: `${requesterName} wants to swap for your "${item.title}"`,
			relatedItemId: itemId,
			relatedSwapRequestId: newRequest.id,
		});

		return newRequest;
	},

	updateStatus: (id: string, status: SwapRequestStatus): SwapRequest | null => {
		const requests = swapRequestsService.getAll();
		const index = requests.findIndex((request) => request.id === id);

		if (index === -1) return null;

		const request = requests[index];
		requests[index] = {
			...request,
			status,
			updatedAt: new Date().toISOString(),
		};

		saveToStorage(STORAGE_KEYS.SWAP_REQUESTS, requests);

		// Create notification for requester
		const notificationType =
			status === SwapRequestStatus.ACCEPTED
				? NotificationType.SWAP_ACCEPTED
				: NotificationType.SWAP_REJECTED;

		const message =
			status === SwapRequestStatus.ACCEPTED
				? `Your swap request for "${request.item.title}" was accepted!`
				: `Your swap request for "${request.item.title}" was rejected.`;

		notificationsService.create({
			userId: request.requesterId,
			type: notificationType,
			title: `Swap Request ${status}`,
			message,
			relatedItemId: request.itemId,
			relatedSwapRequestId: id,
		});

		return requests[index];
	},
};

// Swaps Service
export const swapsService = {
	getAll: (): Swap[] => {
		return getFromStorage<Swap[]>(STORAGE_KEYS.SWAPS, []);
	},

	create: (swapRequestId: string, method: SwapMethod): Swap | null => {
		const request = swapRequestsService.getById(swapRequestId);
		if (!request || request.status !== SwapRequestStatus.ACCEPTED) return null;

		const swaps = swapsService.getAll();
		const newSwap: Swap = {
			id: generateId(),
			method,
			completedAt: new Date().toISOString(),
			itemId: request.itemId,
			item: request.item,
			ownerId: request.item.userId,
			owner: request.item.user,
			swapperId: request.requesterId,
			swapper: request.requester,
		};

		swaps.push(newSwap);
		saveToStorage(STORAGE_KEYS.SWAPS, swaps);

		// Update item status
		itemsService.update(request.itemId, { status: ItemStatus.SWAPPED });

		// Add points transaction for successful swap
		pointsService.addTransaction({
			userId: request.requesterId,
			type: PointsTransactionType.EARNED_SWAP,
			amount: 5,
			description: `Earned 5 points for successful swap of "${request.item.title}"`,
			relatedItemId: request.itemId,
			relatedSwapId: newSwap.id,
		});

		return newSwap;
	},
};

// Notifications Service
export const notificationsService = {
	getAll: (): Notification[] => {
		return getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
	},

	getByUserId: (userId: string): Notification[] => {
		const notifications = notificationsService.getAll();
		return notifications.filter(
			(notification) => notification.userId === userId
		);
	},

	getUnreadCount: (userId: string): number => {
		const notifications = notificationsService.getByUserId(userId);
		return notifications.filter((notification) => !notification.isRead).length;
	},

	create: (data: {
		userId: string;
		type: NotificationType;
		title: string;
		message: string;
		relatedItemId?: string;
		relatedSwapRequestId?: string;
	}): Notification => {
		const notifications = notificationsService.getAll();
		const newNotification: Notification = {
			id: generateId(),
			...data,
			isRead: false,
			createdAt: new Date().toISOString(),
		};

		notifications.push(newNotification);
		saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
		return newNotification;
	},

	markAsRead: (id: string): boolean => {
		const notifications = notificationsService.getAll();
		const index = notifications.findIndex(
			(notification) => notification.id === id
		);

		if (index === -1) return false;

		notifications[index].isRead = true;
		saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
		return true;
	},

	markAllAsRead: (userId: string): void => {
		const notifications = notificationsService.getAll();
		const updatedNotifications = notifications.map((notification) =>
			notification.userId === userId
				? { ...notification, isRead: true }
				: notification
		);
		saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications);
	},

	delete: (id: string): boolean => {
		const notifications = notificationsService.getAll();
		const filteredNotifications = notifications.filter(
			(notification) => notification.id !== id
		);

		if (filteredNotifications.length === notifications.length) return false;

		saveToStorage(STORAGE_KEYS.NOTIFICATIONS, filteredNotifications);
		return true;
	},
};

// Points Service
export const pointsService = {
	getUserPoints: (userId: string): number => {
		const userPoints = getFromStorage<Record<string, number>>(
			STORAGE_KEYS.USER_POINTS,
			{}
		);
		return userPoints[userId] || 0;
	},

	addTransaction: (data: {
		userId: string;
		type: PointsTransactionType;
		amount: number;
		description: string;
		relatedItemId?: string;
		relatedSwapId?: string;
	}): PointsTransaction => {
		const transactions = getFromStorage<PointsTransaction[]>(
			STORAGE_KEYS.POINTS_TRANSACTIONS,
			[]
		);
		const userPoints = getFromStorage<Record<string, number>>(
			STORAGE_KEYS.USER_POINTS,
			{}
		);

		const newTransaction: PointsTransaction = {
			id: generateId(),
			...data,
			createdAt: new Date().toISOString(),
		};

		transactions.push(newTransaction);
		saveToStorage(STORAGE_KEYS.POINTS_TRANSACTIONS, transactions);

		// Update user points
		const currentPoints = userPoints[data.userId] || 0;
		userPoints[data.userId] = currentPoints + data.amount;
		saveToStorage(STORAGE_KEYS.USER_POINTS, userPoints);

		return newTransaction;
	},

	getTransactions: (userId: string): PointsTransaction[] => {
		const transactions = getFromStorage<PointsTransaction[]>(
			STORAGE_KEYS.POINTS_TRANSACTIONS,
			[]
		);
		return transactions.filter((transaction) => transaction.userId === userId);
	},

	canAfford: (userId: string, amount: number): boolean => {
		const currentPoints = pointsService.getUserPoints(userId);
		return currentPoints >= amount;
	},
};

// Admin Service
export const adminService = {
	getStats: (): {
		totalUsers: number;
		totalItems: number;
		totalSwaps: number;
		pendingApprovals: number;
		totalPointsIssued: number;
	} => {
		const items = itemsService.getAll();
		const swaps = swapsService.getAll();
		const userPoints = getFromStorage<Record<string, number>>(
			STORAGE_KEYS.USER_POINTS,
			{}
		);
		const transactions = getFromStorage<PointsTransaction[]>(
			STORAGE_KEYS.POINTS_TRANSACTIONS,
			[]
		);

		const totalPointsIssued = transactions
			.filter(
				(t) =>
					t.type === PointsTransactionType.EARNED_LISTING ||
					t.type === PointsTransactionType.EARNED_SWAP
			)
			.reduce((sum, t) => sum + t.amount, 0);

		return {
			totalUsers: Object.keys(userPoints).length,
			totalItems: items.length,
			totalSwaps: swaps.length,
			pendingApprovals: items.filter(
				(item) => item.status === ItemStatus.PENDING
			).length,
			totalPointsIssued,
		};
	},

	approveItem: (itemId: string): Item | null => {
		return itemsService.update(itemId, { status: ItemStatus.AVAILABLE });
	},

	rejectItem: (itemId: string): Item | null => {
		return itemsService.update(itemId, { status: ItemStatus.REJECTED });
	},

	deleteItem: (itemId: string): boolean => {
		return itemsService.delete(itemId);
	},
};

// User Service
export const userService = {
	getById: (id: string): User | null => {
		const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
		return users.find((user) => user.id === id) || null;
	},

	updateProfile: (userId: string, updates: Partial<User>): User | null => {
		const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
		const index = users.findIndex((user) => user.id === userId);

		if (index === -1) return null;

		users[index] = {
			...users[index],
			...updates,
		};

		saveToStorage(STORAGE_KEYS.USERS, users);
		return users[index];
	},

	updateProfilePicture: (userId: string, pictureUrl: string): User | null => {
		return userService.updateProfile(userId, { picture: pictureUrl });
	},
};

function seedSampleItems() {
	const sampleItems = [
		{
			id: generateId(),
			title: "Vintage Denim Jacket",
			description: "Classic blue denim jacket, barely worn.",
			category: "outerwear",
			type: "casual",
			size: "M",
			condition: "like_new",
			tags: ["denim", "jacket", "vintage"],
			status: "available",
			points: 25,
			location: "Brooklyn, NY",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user1",
			user: {
				id: "user1",
				name: "Alice Smith",
				email: "alice@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop",
					publicId: "img1",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Floral Summer Dress",
			description: "Beautiful floral print, perfect for spring.",
			category: "dresses",
			type: "casual",
			size: "S",
			condition: "good",
			tags: ["dress", "floral", "summer"],
			status: "available",
			points: 30,
			location: "San Francisco, CA",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user2",
			user: {
				id: "user2",
				name: "Bob Lee",
				email: "bob@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
					publicId: "img2",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Designer Sneakers",
			description: "Comfortable white sneakers, lightly used.",
			category: "shoes",
			type: "sporty",
			size: "9",
			condition: "good",
			tags: ["sneakers", "designer", "shoes"],
			status: "available",
			points: 40,
			location: "Austin, TX",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user3",
			user: {
				id: "user3",
				name: "Carol King",
				email: "carol@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
					publicId: "img3",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Cashmere Sweater",
			description: "Soft beige cashmere, cozy and warm.",
			category: "tops",
			type: "luxury",
			size: "L",
			condition: "excellent",
			tags: ["sweater", "cashmere", "cozy"],
			status: "available",
			points: 45,
			location: "Seattle, WA",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user4",
			user: {
				id: "user4",
				name: "David Kim",
				email: "david@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
					publicId: "img4",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Classic Trench Coat",
			description: "Timeless beige trench coat, water-resistant.",
			category: "outerwear",
			type: "formal",
			size: "M",
			condition: "excellent",
			tags: ["coat", "trench", "classic"],
			status: "available",
			points: 60,
			location: "Chicago, IL",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user5",
			user: {
				id: "user5",
				name: "Eve Turner",
				email: "eve@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop",
					publicId: "img5",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Leather Handbag",
			description: "Genuine leather, spacious and stylish.",
			category: "bags",
			type: "luxury",
			size: "one_size",
			condition: "like_new",
			tags: ["handbag", "leather", "bag"],
			status: "available",
			points: 80,
			location: "Los Angeles, CA",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user6",
			user: {
				id: "user6",
				name: "Fiona Green",
				email: "fiona@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
					publicId: "img6",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Wool Scarf",
			description: "Warm wool scarf, perfect for winter.",
			category: "accessories",
			type: "casual",
			size: "one_size",
			condition: "good",
			tags: ["scarf", "wool", "winter"],
			status: "available",
			points: 15,
			location: "Boston, MA",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user7",
			user: {
				id: "user7",
				name: "George Hall",
				email: "george@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop",
					publicId: "img7",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Plaid Button-Up Shirt",
			description: "Red plaid shirt, soft cotton fabric.",
			category: "tops",
			type: "casual",
			size: "L",
			condition: "good",
			tags: ["shirt", "plaid", "cotton"],
			status: "available",
			points: 20,
			location: "Portland, OR",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user8",
			user: {
				id: "user8",
				name: "Hannah Lee",
				email: "hannah@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop",
					publicId: "img8",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Black Ankle Boots",
			description: "Chic black boots, perfect for fall outfits.",
			category: "shoes",
			type: "vintage",
			size: "8",
			condition: "excellent",
			tags: ["boots", "ankle", "black"],
			status: "available",
			points: 55,
			location: "Denver, CO",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user9",
			user: {
				id: "user9",
				name: "Irene Fox",
				email: "irene@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop",
					publicId: "img9",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
		{
			id: generateId(),
			title: "Striped Maxi Skirt",
			description: "Colorful striped skirt, flowy and fun.",
			category: "bottoms",
			type: "casual",
			size: "M",
			condition: "like_new",
			tags: ["skirt", "striped", "maxi"],
			status: "available",
			points: 35,
			location: "Miami, FL",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			userId: "user10",
			user: {
				id: "user10",
				name: "Jackie Chan",
				email: "jackie@example.com",
				role: "user",
			},
			images: [
				{
					id: generateId(),
					imageUrl:
						"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop",
					publicId: "img10",
					itemId: "",
					isPrimary: true,
				},
			],
			swapRequests: [],
		},
	];
	// Set itemId for images
	sampleItems.forEach((item) => {
		item.images = item.images.map((img) => ({ ...img, itemId: item.id }));
	});
	saveToStorage(STORAGE_KEYS.ITEMS, sampleItems);
}
