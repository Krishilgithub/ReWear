import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
	interface Window {
		gtag: (...args: any[]) => void;
		dataLayer: any[];
	}
}

export const useAnalytics = () => {
	const location = useLocation();

	useEffect(() => {
		// Track page views
		if (window.gtag) {
			window.gtag("config", "G-XXXXXXXXXX", {
				page_path: location.pathname + location.search,
				page_title: document.title,
				page_location: window.location.href,
			});
		}
	}, [location]);

	const trackEvent = (
		action: string,
		category: string,
		label?: string,
		value?: number
	) => {
		if (window.gtag) {
			window.gtag("event", action, {
				event_category: category,
				event_label: label,
				value: value,
			});
		}
	};

	const trackUserAction = (action: string, details?: Record<string, any>) => {
		if (window.gtag) {
			window.gtag("event", action, {
				custom_parameters: details,
			});
		}
	};

	return {
		trackEvent,
		trackUserAction,
	};
};

// Predefined events for common actions
export const ANALYTICS_EVENTS = {
	USER_SIGN_UP: "user_sign_up",
	USER_SIGN_IN: "user_sign_in",
	USER_SIGN_OUT: "user_sign_out",
	ITEM_VIEW: "item_view",
	ITEM_LIKE: "item_like",
	ITEM_SWAP_REQUEST: "item_swap_request",
	ITEM_USE_POINTS: "item_use_points",
	SEARCH_PERFORMED: "search_performed",
	FILTER_APPLIED: "filter_applied",
	PROFILE_UPDATE: "profile_update",
	DASHBOARD_VIEW: "dashboard_view",
} as const;
