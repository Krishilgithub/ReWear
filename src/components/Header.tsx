import { Button } from "@/components/ui/button";
import { Heart, Menu, User, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleSignIn = () => {
		navigate("/sign-in");
	};

	const handleGetStarted = () => {
		navigate("/sign-up");
	};

	const handleDashboard = () => {
		navigate("/dashboard");
	};

	const handleProfile = () => {
		navigate("/profile");
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center space-x-2">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 rounded-lg gradient-sage flex items-center justify-center">
							<Heart className="w-4 h-4 text-white" />
						</div>
						<span className="text-xl font-bold text-foreground">ReWear</span>
					</div>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-6">
					{user ? (
						<>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate("/browse")}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Browse Items
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate("/add-item")}
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Add Item
							</Button>
						</>
					) : (
						<>
							<a
								href="#browse"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Browse Items
							</a>
							<a
								href="#how-it-works"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								How It Works
							</a>
							<a
								href="#about"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								About
							</a>
						</>
					)}
				</nav>

				{/* Desktop Actions */}
				<div className="hidden md:flex items-center space-x-4">
					{user ? (
						<>
							<Button variant="ghost" size="sm" onClick={handleDashboard}>
								<ShoppingBag className="w-4 h-4 mr-2" />
								My Items
							</Button>
							<Button variant="ghost" size="sm" onClick={handleProfile}>
								<User className="w-4 h-4 mr-2" />
								Profile
							</Button>
							<Button variant="outline" size="sm" onClick={handleLogout}>
								Sign Out
							</Button>
						</>
					) : (
						<>
							<Button variant="ghost" size="sm" onClick={handleSignIn}>
								Sign In
							</Button>
							<Button
								size="sm"
								className="gradient-sage text-white hover:opacity-90"
								onClick={handleGetStarted}
							>
								Get Started
							</Button>
						</>
					)}
				</div>

				{/* Mobile Menu Button */}
				<Button
					variant="ghost"
					size="sm"
					className="md:hidden"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					<Menu className="w-5 h-5" />
				</Button>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden border-t bg-background">
					<div className="container py-4 space-y-2">
						{user ? (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => navigate('/browse')}
									className="w-full justify-start"
								>
									Browse Items
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => navigate('/add-item')}
									className="w-full justify-start"
								>
									Add Item
								</Button>
							</>
						) : (
							<>
								<a
									href="#browse"
									className="block py-2 text-sm font-medium text-muted-foreground"
								>
									Browse Items
								</a>
								<a
									href="#how-it-works"
									className="block py-2 text-sm font-medium text-muted-foreground"
								>
									How It Works
								</a>
								<a
									href="#about"
									className="block py-2 text-sm font-medium text-muted-foreground"
								>
									About
								</a>
							</>
						)}
						<div className="flex flex-col space-y-2 pt-4">
							{user ? (
								<>
									<Button variant="outline" size="sm" onClick={handleDashboard}>
										Dashboard
									</Button>
									<Button variant="outline" size="sm" onClick={handleProfile}>
										Profile
									</Button>
									<Button variant="outline" size="sm" onClick={handleLogout}>
										Sign Out
									</Button>
								</>
							) : (
								<>
									<Button variant="outline" size="sm" onClick={handleSignIn}>
										Sign In
									</Button>
									<Button
										size="sm"
										className="gradient-sage text-white"
										onClick={handleGetStarted}
									>
										Get Started
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
