import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";

const TestNavigation = () => {
	const navigate = useNavigate();

	const testNavigation = (path: string) => {
		console.log(`Navigating to: ${path}`);
		navigate(path);
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Test Navigation</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Button onClick={() => testNavigation("/add-item")} className="w-full">
					<Plus className="mr-2 h-4 w-4" />
					Test Add Item
				</Button>
				<Button
					onClick={() => testNavigation("/browse")}
					className="w-full"
					variant="outline"
				>
					<Search className="mr-2 h-4 w-4" />
					Test Browse Items
				</Button>
				<Button
					onClick={() => testNavigation("/dashboard")}
					className="w-full"
					variant="secondary"
				>
					Back to Dashboard
				</Button>
			</CardContent>
		</Card>
	);
};

export default TestNavigation;
