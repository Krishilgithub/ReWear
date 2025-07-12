// Import image upload result type
import { ImageUploadResult } from "@/services/imageService";

// Core User Types
export interface User {
	id: string;
	email: string;
	name: string;
	role: "user" | "admin";
	picture?: string;
	authMethod?: "email" | "google";
	points?: number;
	location?: string;
	createdAt?: string;
}

// Item Types
export interface Item {
	id: string;
	title: string;
	description: string;
	category: ItemCategory;
	type: ItemType;
	size: ItemSize;
	condition: ItemCondition;
	tags: string[];
	status: ItemStatus;
	points: number;
	location?: string;
	createdAt: string;
	updatedAt: string;

	userId: string;
	user: User;

	images: ItemImage[];
	swapRequests: SwapRequest[];
}

export interface ItemImage {
	id: string;
	imageUrl: string;
	publicId: string;
	itemId: string;
	isPrimary: boolean;
}

export enum ItemCategory {
	TOPS = "tops",
	BOTTOMS = "bottoms",
	DRESSES = "dresses",
	OUTERWEAR = "outerwear",
	SHOES = "shoes",
	ACCESSORIES = "accessories",
	BAGS = "bags",
	JEWELRY = "jewelry",
}

export enum ItemType {
	CASUAL = "casual",
	FORMAL = "formal",
	BUSINESS = "business",
	SPORTY = "sporty",
	VINTAGE = "vintage",
	LUXURY = "luxury",
}

export enum ItemSize {
	XS = "xs",
	S = "s",
	M = "m",
	L = "l",
	XL = "xl",
	XXL = "xxl",
	ONE_SIZE = "one_size",
}

export enum ItemCondition {
	NEW = "new",
	LIKE_NEW = "like_new",
	EXCELLENT = "excellent",
	GOOD = "good",
	FAIR = "fair",
	POOR = "poor",
}

export enum ItemStatus {
	AVAILABLE = "available",
	PENDING = "pending",
	SWAPPED = "swapped",
	REJECTED = "rejected",
}

// Swap Request Types
export interface SwapRequest {
	id: string;
	status: SwapRequestStatus;
	message?: string;
	createdAt: string;
	updatedAt: string;

	itemId: string;
	item: Item;

	requesterId: string;
	requester: User;
}

export enum SwapRequestStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
	CANCELLED = "cancelled",
}

// Swap Types
export interface Swap {
	id: string;
	method: SwapMethod;
	completedAt: string;

	itemId: string;
	item: Item;

	ownerId: string;
	owner: User;

	swapperId: string;
	swapper: User;
}

export enum SwapMethod {
	SWAP = "swap",
	POINTS = "points",
}

// Notification Types
export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	isRead: boolean;
	createdAt: string;

	userId: string;
	relatedItemId?: string;
	relatedSwapRequestId?: string;
}

export enum NotificationType {
	SWAP_REQUEST = "swap_request",
	SWAP_ACCEPTED = "swap_accepted",
	SWAP_REJECTED = "swap_rejected",
	ITEM_APPROVED = "item_approved",
	ITEM_REJECTED = "item_rejected",
	POINTS_EARNED = "points_earned",
	POINTS_SPENT = "points_spent",
	SYSTEM = "system",
}

// Search & Filter Types
export interface SearchFilters {
	category?: ItemCategory[];
	type?: ItemType[];
	size?: ItemSize[];
	condition?: ItemCondition[];
	minPoints?: number;
	maxPoints?: number;
	location?: string;
	tags?: string[];
}

export interface SearchParams {
	query?: string;
	filters?: SearchFilters;
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "points" | "title";
	sortOrder?: "asc" | "desc";
}

// Points System Types
export interface PointsTransaction {
	id: string;
	type: PointsTransactionType;
	amount: number;
	description: string;
	createdAt: string;

	userId: string;
	relatedItemId?: string;
	relatedSwapId?: string;
}

export enum PointsTransactionType {
	EARNED_LISTING = "earned_listing",
	EARNED_SWAP = "earned_swap",
	SPENT_REDEMPTION = "spent_redemption",
	BONUS = "bonus",
	PENALTY = "penalty",
}

// Admin Types
export interface AdminStats {
	totalUsers: number;
	totalItems: number;
	totalSwaps: number;
	pendingApprovals: number;
	totalPointsIssued: number;
	monthlyGrowth: {
		users: number;
		items: number;
		swaps: number;
	};
}

// Form Types
export interface CreateItemForm {
	title: string;
	description: string;
	category: ItemCategory;
	type: ItemType;
	size: ItemSize;
	condition: ItemCondition;
	tags: string[];
	points: number;
	location?: string;
	images: ImageUploadResult[];
}

export interface UpdateItemForm extends Partial<CreateItemForm> {
	id: string;
}

// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
