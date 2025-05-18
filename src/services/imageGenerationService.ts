import { Recipe } from '../types';

// Backend endpoint for image generation
const BACKEND_IMAGE_API_ENDPOINT = '/api/generate-image';

export interface GeneratedImage {
	recipeId: number;
	recipeName: string;
	imageUrl: string;
	prompt: string;
	createdAt: string;
}

export const generateRecipeImage = async (
	recipe: Recipe
): Promise<GeneratedImage> => {
	try {
		// Create a prompt based on the recipe details
		const prompt = `A professional food photograph of ${recipe.recipeNameEn}, 
      a ${recipe.difficulty} to prepare ${
			recipe.vegetarian ? 'vegetarian' : ''
		} ${recipe.vegan ? 'vegan' : ''} dish. 
      The dish contains ingredients like ${recipe.ingredients
				.slice(0, 3)
				.map((i) => i.ingredient.ingredientDescEn)
				.join(', ')}.`;

		console.log('Requesting image generation from backend...');

		// Call our backend API endpoint instead of directly calling OpenAI
		const response = await fetch(BACKEND_IMAGE_API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				recipe: {
					id: recipe.recipeId,
					name: recipe.recipeNameEn || recipe.recipeNameGr,
					difficulty: recipe.difficulty,
					isVegetarian: recipe.vegetarian,
					isVegan: recipe.vegan,
					ingredients: recipe.ingredients
						.slice(0, 3)
						.map((i) => i.ingredient.ingredientDescEn),
				},
				prompt,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Image generation failed: ${response.status}`, errorText);
			throw new Error(
				`Image generation failed: ${response.status} - ${errorText}`
			);
		}

		const data = await response.json();

		if (!data.imageUrl) {
			console.error('Invalid response format from API:', data);
			throw new Error('Invalid response from image API');
		}

		// Return the generated image info
		return {
			recipeId: recipe.recipeId,
			recipeName: recipe.recipeNameEn || recipe.recipeNameGr || 'Recipe',
			imageUrl: data.imageUrl,
			prompt: data.prompt || prompt,
			createdAt: data.createdAt || new Date().toISOString(),
		};
	} catch (error) {
		console.error('Error generating image:', error);
		// Fall back to placeholder on error
		return getPlaceholderImage(recipe);
	}
};

// Fallback method that returns placeholder images (for development or when API is unavailable)
export const getPlaceholderImage = (recipe: Recipe): GeneratedImage => {
	// Using a more reliable placeholder image service with light green background
	const placeholderUrl = `https://placehold.co/600x400/c6ebc9/333333?text=${encodeURIComponent(
		recipe.recipeNameEn || recipe.recipeNameGr || 'Recipe'
	)}`;

	console.log('Using placeholder image:', placeholderUrl);

	return {
		recipeId: recipe.recipeId,
		recipeName: recipe.recipeNameEn || recipe.recipeNameGr || 'Recipe',
		imageUrl: placeholderUrl,
		prompt: `Placeholder for ${
			recipe.recipeNameEn || recipe.recipeNameGr || 'recipe'
		}`,
		createdAt: new Date().toISOString(),
	};
};
