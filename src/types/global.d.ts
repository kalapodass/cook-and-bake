// Global type declarations

interface Window {
	gtag: (...args: any[]) => void;
	dataLayer: any[];
	// Add ENV if not already included
	ENV?: Record<string, string>;
}
