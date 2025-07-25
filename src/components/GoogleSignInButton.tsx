import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { googleAuthService } from "@/services/googleAuth";

interface GoogleSignInButtonProps {
	onSuccess?: (user: any) => void;
	onError?: (error: Error) => void;
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| "destructive";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
	onSuccess,
	onError,
	variant = "outline",
	size = "default",
	className = "",
	children,
}) => {
	const buttonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const initializeGoogleButton = async () => {
			try {
				await googleAuthService.initialize();

				if (buttonRef.current && window.google) {
					window.google.accounts.id.renderButton(buttonRef.current, {
						type: "standard",
						theme: "outline",
						size: "large",
						text: "signin_with",
						shape: "rectangular",
						logo_alignment: "left",
						width: buttonRef.current.offsetWidth || 300,
					});
				}
			} catch (error) {
				console.error("Failed to initialize Google button:", error);
				if (onError) {
					onError(error as Error);
				}
			}
		};

		initializeGoogleButton();
	}, [onError]);

	useEffect(() => {
		const handleGoogleAuthSuccess = (event: CustomEvent) => {
			if (onSuccess) {
				onSuccess(event.detail.user);
			}
		};

		const handleGoogleAuthError = () => {
			if (onError) {
				onError(new Error("Google authentication failed"));
			}
		};

		window.addEventListener(
			"googleAuthSuccess",
			handleGoogleAuthSuccess as EventListener
		);
		window.addEventListener("googleAuthError", handleGoogleAuthError);

		return () => {
			window.removeEventListener(
				"googleAuthSuccess",
				handleGoogleAuthSuccess as EventListener
			);
			window.removeEventListener("googleAuthError", handleGoogleAuthError);
		};
	}, [onSuccess, onError]);

	// Fallback button if Google script fails to load
	const handleFallbackClick = async () => {
		try {
			const user = await googleAuthService.signIn();
			if (onSuccess) {
				onSuccess(user);
			}
		} catch (error) {
			if (onError) {
				onError(error as Error);
			}
		}
	};

	return (
		<div className={className}>
			{/* Google will render its button here */}
			<div ref={buttonRef} className="w-full" />

			{/* Fallback button (hidden by default, shown if Google button fails) */}
			<Button
				variant={variant}
				size={size}
				onClick={handleFallbackClick}
				className="w-full hidden"
				id="google-fallback-button"
			>
				<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="currentColor"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="currentColor"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="currentColor"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				{children || "Continue with Google"}
			</Button>
		</div>
	);
};

export default GoogleSignInButton;
