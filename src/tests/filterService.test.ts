import { describe, expect, it } from 'vitest';
import {
	extractCuisines,
	extractTags,
	filterRecipes,
} from '../services/filterService';
import { Recipe } from '../types';

// Mock recipe data for testing
const mockRecipes: Recipe[] = [
	{
		recipeId: 1,
		recipeNameEn: 'Greek Salad',
		recipeNameGr: 'Ελληνική Σαλάτα',
		prepTime: 15,
		cookTime: 0,
		totalTime: 15,
		servings: 4,
		vegan: true,
		vegetarian: true,
		cuisines: [
			{ cuisineId: 4, cuisineNameEn: 'Greek', cuisineNameGr: 'Ελληνική' },
		],
		ingredients: [],
		steps: [],
		nutritionalInfo: { calories: 250, protein: 5, carbs: 15, fat: 20 },
		difficulty: 'easy',
		tags: [
			{ tagEn: 'salad', tagGr: 'σαλάτα' },
			{ tagEn: 'vegetarian', tagGr: 'χορτοφαγικό' },
			{ tagEn: 'vegan', tagGr: 'βίγκαν' },
			{ tagEn: 'healthy', tagGr: 'υγιεινό' },
		],
		images: [],
		createdAt: '2023-01-01T12:00:00Z',
		updatedAt: '2023-01-01T12:00:00Z',
	},
	{
		recipeId: 2,
		recipeNameEn: 'Spaghetti Carbonara',
		recipeNameGr: 'Σπαγγέτι Καρμπονάρα',
		prepTime: 10,
		cookTime: 15,
		totalTime: 25,
		servings: 4,
		vegan: false,
		vegetarian: false,
		cuisines: [
			{ cuisineId: 1, cuisineNameEn: 'Italian', cuisineNameGr: 'Ιταλική' },
		],
		ingredients: [],
		steps: [],
		nutritionalInfo: { calories: 450, protein: 20, carbs: 60, fat: 15 },
		difficulty: 'medium',
		tags: [
			{ tagEn: 'pasta', tagGr: 'ζυμαρικά' },
			{ tagEn: 'dinner', tagGr: 'βραδινό' },
			{ tagEn: 'quick', tagGr: 'γρήγορο' },
		],
		images: [],
		createdAt: '2023-01-02T12:00:00Z',
		updatedAt: '2023-01-02T12:00:00Z',
	},
	{
		recipeId: 3,
		recipeNameEn: 'Chicken Tacos',
		recipeNameGr: 'Τάκος με Κοτόπουλο',
		prepTime: 20,
		cookTime: 15,
		totalTime: 35,
		servings: 4,
		vegan: false,
		vegetarian: false,
		cuisines: [
			{ cuisineId: 6, cuisineNameEn: 'Mexican', cuisineNameGr: 'Μεξικάνικη' },
		],
		ingredients: [],
		steps: [],
		nutritionalInfo: { calories: 350, protein: 30, carbs: 30, fat: 10 },
		difficulty: 'easy',
		tags: [
			{ tagEn: 'chicken', tagGr: 'κοτόπουλο' },
			{ tagEn: 'dinner', tagGr: 'βραδινό' },
			{ tagEn: 'quick', tagGr: 'γρήγορο' },
		],
		images: [],
		createdAt: '2023-01-03T12:00:00Z',
		updatedAt: '2023-01-03T12:00:00Z',
	},
	{
		recipeId: 4,
		recipeNameEn: 'Margherita Pizza',
		recipeNameGr: 'Πίτσα Μαργαρίτα',
		prepTime: 30,
		cookTime: 15,
		totalTime: 45,
		servings: 4,
		vegan: false,
		vegetarian: true,
		cuisines: [
			{ cuisineId: 1, cuisineNameEn: 'Italian', cuisineNameGr: 'Ιταλική' },
		],
		ingredients: [],
		steps: [],
		nutritionalInfo: { calories: 300, protein: 12, carbs: 40, fat: 10 },
		difficulty: 'medium',
		tags: [
			{ tagEn: 'pizza', tagGr: 'πίτσα' },
			{ tagEn: 'vegetarian', tagGr: 'χορτοφαγικό' },
			{ tagEn: 'dinner', tagGr: 'βραδινό' },
		],
		images: [],
		createdAt: '2023-01-04T12:00:00Z',
		updatedAt: '2023-01-04T12:00:00Z',
	},
];

describe('filterRecipes', () => {
	it('should return all recipes when no filters are applied', () => {
		const result = filterRecipes(mockRecipes, { cuisines: [], tags: [] });
		expect(result).toEqual(mockRecipes);
		expect(result.length).toBe(4);
	});

	it('should filter recipes by cuisine ID', () => {
		const result = filterRecipes(mockRecipes, { cuisines: [1], tags: [] });
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId)).toEqual([2, 4]);
	});

	it('should filter recipes by tag in English', () => {
		const result = filterRecipes(mockRecipes, {
			cuisines: [],
			tags: ['vegetarian'],
		});
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId)).toEqual([1, 4]);
	});

	it('should filter recipes by tag in Greek', () => {
		const result = filterRecipes(mockRecipes, {
			cuisines: [],
			tags: ['χορτοφαγικό'],
		});
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId)).toEqual([1, 4]);
	});

	it('should apply both cuisine and tag filters (AND logic)', () => {
		const result = filterRecipes(mockRecipes, {
			cuisines: [1],
			tags: ['vegetarian'],
		});
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(4);
	});

	it('should handle case insensitivity for tags', () => {
		const result = filterRecipes(mockRecipes, {
			cuisines: [],
			tags: ['VEGETARIAN'],
		});
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId)).toEqual([1, 4]);
	});

	it('should return empty array when no recipes match the filters', () => {
		const result = filterRecipes(mockRecipes, { cuisines: [5], tags: [] });
		expect(result).toEqual([]);
	});

	it('should filter recipes by multiple cuisines (OR logic between cuisines)', () => {
		const result = filterRecipes(mockRecipes, { cuisines: [4, 6], tags: [] });
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId)).toEqual([1, 3]);
	});

	it('should filter recipes by multiple tags (AND logic between tags)', () => {
		const result = filterRecipes(mockRecipes, {
			cuisines: [],
			tags: ['vegetarian', 'vegan'],
		});
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(1);
	});
});

describe('extractCuisines', () => {
	it('should extract unique cuisines from recipes', () => {
		const result = extractCuisines(mockRecipes);
		expect(result.length).toBe(3);
		expect(result.map((c) => c.id).sort()).toEqual([1, 4, 6]);
	});

	it('should include cuisine details in extracted cuisines', () => {
		const result = extractCuisines(mockRecipes);
		const italian = result.find((c) => c.id === 1);
		expect(italian).toEqual({
			id: 1,
			nameEn: 'Italian',
			nameGr: 'Ιταλική',
		});
	});

	it('should return empty array when no recipes are provided', () => {
		const result = extractCuisines([]);
		expect(result).toEqual([]);
	});
});

describe('extractTags', () => {
	it('should extract unique tags from recipes', () => {
		const result = extractTags(mockRecipes);
		expect(result.length).toBe(9); // 9 unique tags across all mock recipes

		// Check some of the expected tags are present
		const tagNames = result.map((t) => t.tagEn);
		expect(tagNames).toContain('vegetarian');
		expect(tagNames).toContain('vegan');
		expect(tagNames).toContain('pizza');
		expect(tagNames).toContain('pasta');
	});

	it('should include both English and Greek versions in extracted tags', () => {
		const result = extractTags(mockRecipes);
		const vegetarianTag = result.find((t) => t.tagEn === 'vegetarian');
		expect(vegetarianTag).toEqual({
			tagEn: 'vegetarian',
			tagGr: 'χορτοφαγικό',
		});
	});

	it('should handle case insensitivity and deduplication of tags', () => {
		const recipesWithDuplicateTags = [
			...mockRecipes,
			{
				...mockRecipes[0],
				recipeId: 5,
				tags: [
					{ tagEn: 'VEGETARIAN', tagGr: 'ΧΟΡΤΟΦΑΓΙΚΌ' }, // Same as existing but different case
					{ tagEn: 'new tag', tagGr: 'νέα ετικέτα' },
				],
			},
		];

		const result = extractTags(recipesWithDuplicateTags);
		// Should still have 8 unique tags + 1 new tag = 9
		expect(result.length).toBe(9);
	});

	it('should return empty array when no recipes are provided', () => {
		const result = extractTags([]);
		expect(result).toEqual([]);
	});
});
