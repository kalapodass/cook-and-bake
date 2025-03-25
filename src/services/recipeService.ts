import { Recipe } from '../types';

export const fetchRecipes = async (): Promise<Recipe[]> => {
	try {
		const response = await fetch('/data/recipes.json');

		if (!response.ok) {
			throw new Error(`Failed to fetch recipes: ${response.status}`);
		}

		// The JSON file contains a single recipe, we'll convert it to an array
		const recipe = await response.json();
		return [recipe]; // Return as array for consistency

		// If your recipes.json is actually an array of recipes, use this instead:
		// return await response.json();
	} catch (error) {
		console.error('Error fetching recipes:', error);
		return [];
	}
};
