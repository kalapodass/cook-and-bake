import { Recipe } from '../types';

export const fetchRecipes = async (): Promise<Recipe[]> => {
	try {
		// Use a relative path rather than absolute
		const response = await fetch('./data/recipes.json');
		console.log('Fetch response status:', response.status);

		if (!response.ok) {
			throw new Error(`Failed to fetch recipes: ${response.status}`);
		}

		const data = await response.json();

		// Handle both array and single object formats
		if (Array.isArray(data)) {
			return data;
		} else if (data && typeof data === 'object') {
			return [data];
		} else {
			return [];
		}
	} catch (error) {
		console.error('Error fetching recipes:', error);
		return [];
	}
};
