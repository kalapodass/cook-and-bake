import { Recipe } from '../types';

// Add type declaration for ENV on window
declare global {
	interface Window {
		ENV?: Record<string, string>;
	}
}

// Helper function to safely access environment variables
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
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

// Replace with your actual API key and endpoint when available
const AI_IMAGE_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';
const API_KEY = getEnvVariable('REACT_APP_OPENAI_API_KEY', '');

// Check if we have API access
const hasApiAccess = !!API_KEY;
console.log('OpenAI API access available:', hasApiAccess);

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
		if (!API_KEY) {
			console.warn('No API key found. Falling back to placeholder image.');
			return getPlaceholderImage(recipe);
		}

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
			const errorText = await response.text();
			console.error(`Image generation failed: ${response.status}`, errorText);
			throw new Error(
				`Image generation failed: ${response.status} - ${errorText}`
			);
		}

		const data = await response.json();
		console.log('Image generation successful:', data);

		if (!data.data || !data.data[0] || !data.data[0].url) {
			console.error('Invalid response format from API:', data);
			throw new Error('Invalid response from image API');
		}

		// Return the generated image info
		return {
			recipeId: recipe.recipeId,
			recipeName: recipe.recipeNameEn || recipe.recipeNameGr || 'Recipe',
			imageUrl: data.data[0].url,
			prompt,
			createdAt: new Date().toISOString(),
		};
	} catch (error) {
		console.error('Error generating image:', error);
		// Fall back to placeholder on error
		return getPlaceholderImage(recipe);
	}
};

// Fallback method that returns placeholder images (for development or when API is unavailable)
export const getPlaceholderImage = (recipe: Recipe): GeneratedImage => {
	// Using a more reliable placeholder image service
	const placeholderUrl = `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(
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
