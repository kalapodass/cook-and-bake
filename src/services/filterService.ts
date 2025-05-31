import { Recipe } from '../types';

export interface FilterOptions {
	cuisines: number[];
	tags: string[];
}

/**
 * Filter recipes based on selected cuisines and tags
 * @param recipes The list of recipes to filter
 * @param options The filtering options containing cuisines and tags
 * @returns Filtered recipes that match all selected criteria
 */
export const filterRecipes = (
	recipes: Recipe[],
	options: FilterOptions
): Recipe[] => {
	const { cuisines, tags } = options;

	// If no filters are selected, return all recipes
	if (cuisines.length === 0 && tags.length === 0) {
		return recipes;
	}

	// Convert cuisines and tags to Sets for faster lookups
	const cuisineSet = new Set(cuisines);
	const tagSet = new Set(tags.map((tag) => tag.toLowerCase()));

	return recipes.filter((recipe) => {
		// Check if recipe matches cuisine filter
		const matchesCuisine =
			cuisineSet.size === 0 ||
			recipe.cuisines.some((cuisine) => cuisineSet.has(cuisine.cuisineId));

		// Check if recipe matches tag filter
		const matchesTags =
			tagSet.size === 0 ||
			tags.every((tag) =>
				recipe.tags.some(
					(recipeTag) =>
						recipeTag.tagEn.toLowerCase() === tag.toLowerCase() ||
						recipeTag.tagGr.toLowerCase() === tag.toLowerCase()
				)
			);

		// Recipe must match both cuisine AND tag filters
		return matchesCuisine && matchesTags;
	});
};

/**
 * Extract all unique cuisines from recipes
 * @param recipes The list of recipes
 * @returns Array of unique cuisines
 */
export const extractCuisines = (recipes: Recipe[]) => {
	const cuisinesMap = new Map<
		number,
		{ id: number; nameEn: string; nameGr: string }
	>();

	recipes.forEach((recipe) => {
		recipe.cuisines.forEach((cuisine) => {
			cuisinesMap.set(cuisine.cuisineId, {
				id: cuisine.cuisineId,
				nameEn: cuisine.cuisineNameEn,
				nameGr: cuisine.cuisineNameGr,
			});
		});
	});

	return Array.from(cuisinesMap.values());
};

/**
 * Extract all unique tags from recipes
 * @param recipes The list of recipes
 * @returns Array of unique tags with English and Greek versions
 */
export const extractTags = (recipes: Recipe[]) => {
	const tagsMap = new Map<string, { tagEn: string; tagGr: string }>();

	recipes.forEach((recipe) => {
		recipe.tags.forEach((tag) => {
			const key = tag.tagEn.toLowerCase();
			tagsMap.set(key, {
				tagEn: tag.tagEn,
				tagGr: tag.tagGr,
			});
		});
	});

	return Array.from(tagsMap.values());
};
