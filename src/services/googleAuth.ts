// Google Authentication Service
declare global {
	interface Window {
		google: {
			accounts: {
				id: {
					initialize: (config: any) => void;
					renderButton: (element: HTMLElement, options: any) => void;
					prompt: () => void;
					disableAutoSelect: () => void;
					storeCredential: (credential: any, callback: () => void) => void;
					cancel: () => void;
					revoke: (hint: string, callback: () => void) => void;
				};
			};
		};
	}
}

export interface GoogleUser {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}

export interface GoogleCredentialResponse {
	credential: string;
	select_by: string;
}

class GoogleAuthService {
	private clientId: string;
	private isInitialized: boolean = false;

	constructor() {
		this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
		if (!this.clientId) {
			console.warn(
				"Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your environment variables."
			);
		}
	}

	async initialize(): Promise<void> {
		if (this.isInitialized || !this.clientId) return;

		return new Promise((resolve, reject) => {
			// Load Google Identity Services script
			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;

			script.onload = () => {
				try {
					window.google.accounts.id.initialize({
						client_id: this.clientId,
						callback: this.handleCredentialResponse.bind(this),
						auto_select: false,
						cancel_on_tap_outside: true,
					});
					this.isInitialized = true;
					resolve();
				} catch (error) {
					reject(error);
				}
			};

			script.onerror = () => {
				reject(new Error("Failed to load Google Identity Services"));
			};

			document.head.appendChild(script);
		});
	}

	private handleCredentialResponse(response: GoogleCredentialResponse): void {
		// This will be called by Google after successful authentication
		const credential = response.credential;

		// Decode the JWT token to get user info
		const payload = this.decodeJwt(credential);

		// Store the credential and user info
		localStorage.setItem("google_credential", credential);
		localStorage.setItem("google_user", JSON.stringify(payload));

		// Trigger a custom event that the app can listen to
		window.dispatchEvent(
			new CustomEvent("googleAuthSuccess", {
				detail: { user: payload, credential },
			})
		);
	}

	private decodeJwt(token: string): GoogleUser {
		try {
			const base64Url = token.split(".")[1];
			const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split("")
					.map(function (c) {
						return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join("")
			);
			return JSON.parse(jsonPayload);
		} catch (error) {
			throw new Error("Failed to decode JWT token");
		}
	}

	async signIn(): Promise<GoogleUser> {
		if (!this.isInitialized) {
			await this.initialize();
		}

		return new Promise((resolve, reject) => {
			const handleAuthSuccess = (event: CustomEvent) => {
				window.removeEventListener(
					"googleAuthSuccess",
					handleAuthSuccess as EventListener
				);
				resolve(event.detail.user);
			};

			const handleAuthError = () => {
				window.removeEventListener("googleAuthError", handleAuthError);
				reject(new Error("Google authentication failed"));
			};

			window.addEventListener(
				"googleAuthSuccess",
				handleAuthSuccess as EventListener
			);
			window.addEventListener("googleAuthError", handleAuthError);

			try {
				window.google.accounts.id.prompt();
			} catch (error) {
				reject(error);
			}
		});
	}

	async signOut(): Promise<void> {
		const hint = localStorage.getItem("google_credential");
		if (hint) {
			return new Promise((resolve) => {
				window.google.accounts.id.revoke(hint, () => {
					localStorage.removeItem("google_credential");
					localStorage.removeItem("google_user");
					resolve();
				});
			});
		}
	}

	getCurrentUser(): GoogleUser | null {
		const userStr = localStorage.getItem("google_user");
		if (userStr) {
			try {
				return JSON.parse(userStr);
			} catch (error) {
				console.error("Failed to parse stored Google user:", error);
				return null;
			}
		}
		return null;
	}

	isSignedIn(): boolean {
		return !!localStorage.getItem("google_credential");
	}
}

export const googleAuthService = new GoogleAuthService();
