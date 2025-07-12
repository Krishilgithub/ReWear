import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics, ANALYTICS_EVENTS } from "@/hooks/useAnalytics";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const SignUp = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { login, loginWithGoogle } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();
	const { trackEvent, trackUserAction } = useAnalytics();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Basic validation
		if (formData.password !== formData.confirmPassword) {
			trackEvent(
				"signup_validation_error",
				"authentication",
				"password_mismatch"
			);
			toast({
				title: "Passwords don't match",
				description: "Please make sure your passwords match.",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		if (formData.password.length < 6) {
			trackEvent(
				"signup_validation_error",
				"authentication",
				"password_too_short"
			);
			toast({
				title: "Password too short",
				description: "Password must be at least 6 characters long.",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		try {
			// Track signup attempt
			trackEvent("signup_attempt", "authentication", "email");
			trackUserAction("signup_started", { method: "email" });

			// This would call your serverless function for signup
			// const response = await fetch('/api/auth/signup', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(formData)
			// });

			// For now, simulate successful signup and auto-login
			trackEvent(ANALYTICS_EVENTS.USER_SIGN_UP, "authentication", "email");
			trackUserAction("signup_success", {
				method: "email",
				hasPhone: !!formData.phone,
			});

			toast({
				title: "Account created successfully!",
				description: "Welcome to ReWear! You've been signed in.",
			});

			// Auto-login after signup
			await login(formData.email, formData.password);
			navigate("/dashboard");
		} catch (error) {
			trackEvent("signup_failed", "authentication", "email");
			trackUserAction("signup_error", {
				method: "email",
				error: error instanceof Error ? error.message : "Unknown error",
			});

			toast({
				title: "Sign up failed",
				description: "Please check your information and try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async () => {
		try {
			trackEvent("google_signup_attempt", "authentication", "google");
			trackUserAction("signup_started", { method: "google" });

			await loginWithGoogle();

			trackEvent(ANALYTICS_EVENTS.USER_SIGN_UP, "authentication", "google");
			trackUserAction("signup_success", { method: "google" });

			toast({
				title: "Account created successfully!",
				description: "Welcome to ReWear! You've been signed in with Google.",
			});
			navigate("/dashboard");
		} catch (error) {
			trackEvent("google_signup_failed", "authentication", "google");
			trackUserAction("signup_error", {
				method: "google",
				error: error instanceof Error ? error.message : "Unknown error",
			});

			toast({
				title: "Google sign up failed",
				description: "Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleNavigateToSignIn = () => {
		trackEvent("navigate_to_signin", "navigation", "signin_link");
		navigate("/sign-in");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">
						Create your account
					</CardTitle>
					<CardDescription>
						Join ReWear and start your sustainable fashion journey
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<GoogleSignInButton
						onSuccess={handleGoogleSignUp}
						onError={(error) => {
							trackEvent("google_signup_failed", "authentication", "google");
							trackUserAction("signup_error", {
								method: "google",
								error: error.message,
							});
							toast({
								title: "Google sign up failed",
								description: "Please try again.",
								variant: "destructive",
							});
						}}
						className="w-full"
					/>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with email
							</span>
						</div>
					</div>

					<form onSubmit={handleSignUp} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={handleInputChange}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleInputChange}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number (Optional)</Label>
							<div className="relative">
								<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="phone"
									name="phone"
									type="tel"
									placeholder="Enter your phone number"
									value={formData.phone}
									onChange={handleInputChange}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Create a password"
									value={formData.password}
									onChange={handleInputChange}
									className="pl-10 pr-10"
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className="pl-10 pr-10"
									required
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create account"}
						</Button>
					</form>

					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							Already have an account?{" "}
						</span>
						<Button
							variant="link"
							className="p-0"
							onClick={handleNavigateToSignIn}
						>
							Sign in
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignUp;
