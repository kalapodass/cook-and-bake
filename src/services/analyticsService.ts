import { getEnvVariable } from './imageGenerationService';

// Don't redeclare global window properties here since they're already in global.d.ts
// Just reference the existing type
export interface PageviewParams {
	path: string;
	title?: string;
}

export interface EventParams {
	action: string;
	category: string;
	label?: string;
	value?: number;
}

// Get analytics ID from environment variables
const ANALYTICS_ID = getEnvVariable('REACT_APP_GA_TRACKING_ID', '');

// Send pageview to Google Analytics
export const sendPageview = ({ path, title }: PageviewParams): void => {
	if (typeof window === 'undefined' || !window.gtag) {
		console.warn('Google Analytics not loaded');
		return;
	}

	if (!ANALYTICS_ID) {
		console.warn('Google Analytics ID not configured');
		return;
	}

	window.gtag('config', ANALYTICS_ID, {
		page_path: path,
		page_title: title,
	});
};

// Send event to Google Analytics
export const sendEvent = ({
	action,
	category,
	label,
	value,
}: EventParams): void => {
	if (typeof window === 'undefined' || !window.gtag) {
		console.warn('Google Analytics not loaded');
		return;
	}

	if (!ANALYTICS_ID) {
		console.warn('Google Analytics ID not configured');
		return;
	}

	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
