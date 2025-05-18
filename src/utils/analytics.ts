// Google Analytics utilities

interface PageviewParams {
	path: string;
	title?: string;
}

interface EventParams {
	action: string;
	category: string;
	label?: string;
	value?: number;
}

// Send pageview to Google Analytics
export const sendPageview = ({ path, title }: PageviewParams): void => {
	if (!window.gtag) {
		console.warn('Google Analytics not loaded');
		return;
	}

	window.gtag('config', 'G-XXXXXXXXXX', {
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
	if (!window.gtag) {
		console.warn('Google Analytics not loaded');
		return;
	}

	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};

// Declare global window interface
declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}
}
