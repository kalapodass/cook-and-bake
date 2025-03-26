import { Recipe } from '../types';

export const fetchRecipes = async (): Promise<Recipe[]> => {
	try {
		console.log('Fetching recipes from server...');
		// Use a relative path rather than absolute
		const response = await fetch('./data/recipes.json');
		console.log('Fetch response status:', response.status);

		if (!response.ok) {
			throw new Error(`Failed to fetch recipes: ${response.status}`);
		}

		const data = await response.json();
		console.log('Recipe data received:', data);

		// Handle both array and single object formats
		if (Array.isArray(data)) {
			console.log(`Returning ${data.length} recipes`);
			return data;
		} else if (data && typeof data === 'object') {
			console.log('Received single recipe, converting to array');
			return [data];
		} else {
			console.log('Received unexpected data format:', typeof data);
			return [];
		}
	} catch (error) {
		console.error('Error fetching recipes:', error);
		return [];
	}
};
