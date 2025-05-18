// Add type declaration for ENV on window
declare global {
	interface Window {
		ENV?: Record<string, string>;
	}
}

// Helper function to safely access environment variables
export const getEnvVariable = (
	key: string,
	defaultValue: string = ''
): string => {
	// For Vite
	if (typeof import.meta !== 'undefined' && import.meta.env) {
		return import.meta.env[key] || defaultValue;
	}

	// For Create React App or similar bundlers
	if (typeof window !== 'undefined' && typeof window.ENV !== 'undefined') {
		return window.ENV?.[key] || defaultValue;
	}

	// For webpack DefinePlugin or similar
	if (typeof process !== 'undefined' && process.env) {
		return process.env[key] || defaultValue;
	}

	return defaultValue;
};
