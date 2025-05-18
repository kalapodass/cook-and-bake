import { Recipe } from '../types';

// Replace with your actual API key and endpoint when available
const AI_IMAGE_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

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

		console.log('Generating image with prompt:', prompt);

		// Call the AI image generation API
		const response = await fetch(AI_IMAGE_API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				prompt,
				n: 1,
				size: '512x512',
				response_format: 'url',
			}),
		});

		if (!response.ok) {
			throw new Error(`Image generation failed: ${response.status}`);
		}

		const data = await response.json();

		// Return the generated image info
		return {
			recipeId: recipe.recipeId,
			recipeName: recipe.recipeNameEn,
			imageUrl: data.data[0].url,
			prompt,
			createdAt: new Date().toISOString(),
		};
	} catch (error) {
		console.error('Error generating image:', error);
		throw error;
	}
};

// Fallback method that returns placeholder images (for development or when API is unavailable)
export const getPlaceholderImage = (recipe: Recipe): GeneratedImage => {
	return {
		recipeId: recipe.recipeId,
		recipeName: recipe.recipeNameEn,
		imageUrl: `/images/placeholders/food-${(recipe.recipeId % 5) + 1}.jpg`,
		prompt: `Placeholder image for ${recipe.recipeNameEn}`,
		createdAt: new Date().toISOString(),
	};
};
