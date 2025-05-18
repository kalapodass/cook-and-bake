import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendPageview } from '../utils/analytics';

/**
 * Hook to handle Google Analytics page tracking
 */
const useAnalytics = (): void => {
	const location = useLocation();

	useEffect(() => {
		// Send pageview when location changes
		sendPageview({
			path: location.pathname + location.search,
			title: document.title,
		});
	}, [location]);
};

export default useAnalytics;
