import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockProduct = {
	id: "1",
	title: "Blue Denim Jacket",
	description: "A classic blue denim jacket in excellent condition. Size M.",
	status: "Available",
	images: [
		"/placeholder-item.jpg",
		"/placeholder-item.jpg",
		"/placeholder-item.jpg",
	],
};

const mockPreviousListings = [
	{ id: "2", image: "/placeholder-item.jpg" },
	{ id: "3", image: "/placeholder-item.jpg" },
	{ id: "4", image: "/placeholder-item.jpg" },
	{ id: "5", image: "/placeholder-item.jpg" },
];

const ProductDetail: React.FC = () => {
	return (
		<div className="min-h-screen bg-background p-8">
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<CardTitle>Product Detail Page</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-8">
						{/* Left: Image Gallery */}
						<div className="flex flex-col items-center w-full md:w-1/2">
							<img
								src={mockProduct.images[0]}
								alt={mockProduct.title}
								className="w-full h-64 object-cover rounded-lg mb-4"
							/>
							<div className="flex space-x-2">
								{mockProduct.images.map((img, idx) => (
									<img
										key={idx}
										src={img}
										alt={`Thumbnail ${idx + 1}`}
										className="w-16 h-16 object-cover rounded border"
									/>
								))}
							</div>
						</div>
						{/* Right: Description and Status */}
						<div className="flex-1 space-y-4">
							<h2 className="text-2xl font-bold">{mockProduct.title}</h2>
							<p className="text-muted-foreground">{mockProduct.description}</p>
							<Button variant="outline" className="mt-2">
								{mockProduct.status === "Available" ? "Available" : "Swap"}
							</Button>
							<Separator className="my-4" />
							<div>
								<h3 className="font-semibold mb-2">Add Product Description</h3>
								<textarea
									className="w-full min-h-[100px] border rounded p-2"
									placeholder="Add product description..."
									defaultValue={mockProduct.description}
								/>
							</div>
						</div>
					</div>
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

export default ProductDetail;
