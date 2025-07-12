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
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { login, loginWithGoogle } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();
	const { trackEvent, trackUserAction } = useAnalytics();

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await login(email, password);

			// Track successful sign in
			trackEvent(ANALYTICS_EVENTS.USER_SIGN_IN, "authentication", "email");
			trackUserAction("sign_in_success", { method: "email" });

			toast({
				title: "Welcome back!",
				description: "You've been successfully signed in.",
			});
			navigate("/");
		} catch (error) {
			// Track failed sign in
			trackEvent("sign_in_failed", "authentication", "email");
			trackUserAction("sign_in_error", {
				method: "email",
				error: error instanceof Error ? error.message : "Unknown error",
			});

			toast({
				title: "Sign in failed",
				description: "Please check your credentials and try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		try {
			// Track Google sign in attempt
			trackEvent("google_sign_in_attempt", "authentication", "google");

			await loginWithGoogle();

			// Track successful Google sign in
			trackEvent(ANALYTICS_EVENTS.USER_SIGN_IN, "authentication", "google");
			trackUserAction("sign_in_success", { method: "google" });

			toast({
				title: "Welcome back!",
				description: "You've been successfully signed in with Google.",
			});
			navigate("/");
		} catch (error) {
			// Track failed Google sign in
			trackEvent("google_sign_in_failed", "authentication", "google");
			trackUserAction("sign_in_error", {
				method: "google",
				error: error instanceof Error ? error.message : "Unknown error",
			});

			toast({
				title: "Google sign in failed",
				description: "Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleNavigateToSignUp = () => {
		trackEvent("navigate_to_signup", "navigation", "signup_link");
		navigate("/sign-up");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<GoogleSignInButton
						onSuccess={handleGoogleLogin}
						onError={(error) => {
							trackEvent("google_sign_in_failed", "authentication", "google");
							trackUserAction("sign_in_error", {
								method: "google",
								error: error.message,
							});
							toast({
								title: "Google sign in failed",
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

					<form onSubmit={handleEmailLogin} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
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

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="text-center text-sm">
						<span className="text-muted-foreground">
							Don't have an account?{" "}
						</span>
						<Button
							variant="link"
							className="p-0"
							onClick={handleNavigateToSignUp}
						>
							Sign up
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignIn;
