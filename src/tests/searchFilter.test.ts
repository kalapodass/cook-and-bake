import { describe, expect, it, vi } from 'vitest';
import { filterRecipes } from '../services/filterService';
import { Recipe } from '../types';

// Helper function to simulate the applyFilters functionality
const applyFilters = (
	recipes: Recipe[],
	filters: { cuisines: number[]; tags: string[] },
	searchTerm: string
) => {
	// First apply category/tag filters
	let filtered = filterRecipes(recipes, filters);

	// Then apply search term if present
	if (searchTerm.trim()) {
		const searchLower = searchTerm.toLowerCase();
		filtered = filtered.filter(
			(recipe) =>
				recipe.recipeNameEn.toLowerCase().includes(searchLower) ||
				recipe.recipeNameGr.toLowerCase().includes(searchLower)
		);
	}

	return filtered;
};

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
		],
		images: [],
		createdAt: '2023-01-02T12:00:00Z',
		updatedAt: '2023-01-02T12:00:00Z',
	},
	{
		recipeId: 3,
		recipeNameEn: 'Greek Pizza',
		recipeNameGr: 'Ελληνική Πίτσα',
		prepTime: 20,
		cookTime: 15,
		totalTime: 35,
		servings: 4,
		vegan: false,
		vegetarian: true,
		cuisines: [
			{ cuisineId: 4, cuisineNameEn: 'Greek', cuisineNameGr: 'Ελληνική' },
			{ cuisineId: 1, cuisineNameEn: 'Italian', cuisineNameGr: 'Ιταλική' },
		],
		ingredients: [],
		steps: [],
		nutritionalInfo: { calories: 350, protein: 30, carbs: 30, fat: 10 },
		difficulty: 'easy',
		tags: [
			{ tagEn: 'pizza', tagGr: 'πίτσα' },
			{ tagEn: 'vegetarian', tagGr: 'χορτοφαγικό' },
		],
		images: [],
		createdAt: '2023-01-03T12:00:00Z',
		updatedAt: '2023-01-03T12:00:00Z',
	},
];

describe('Combined search and filter functionality', () => {
	it('should filter recipes by search term only', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [], tags: [] },
			'pizza'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(3);
	});

	it('should filter recipes by search term in Greek name', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [], tags: [] },
			'Σαλάτα'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(1);
	});

	it('should filter recipes by cuisine only', () => {
		const result = applyFilters(mockRecipes, { cuisines: [1], tags: [] }, '');
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId).sort()).toEqual([2, 3]);
	});

	it('should filter recipes by tag only', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [], tags: ['vegetarian'] },
			''
		);
		expect(result.length).toBe(2);
		expect(result.map((r) => r.recipeId).sort()).toEqual([1, 3]);
	});

	it('should filter recipes by combination of search term and cuisine', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [4], tags: [] },
			'pizza'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(3);
	});

	it('should filter recipes by combination of search term and tag', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [], tags: ['vegetarian'] },
			'pizza'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(3);
	});

	it('should filter recipes by combination of search term, cuisine and tag', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [1], tags: ['vegetarian'] },
			'greek'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(3);
	});

	it('should return no results when no matches are found', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [1], tags: ['salad'] },
			'lasagna'
		);
		expect(result.length).toBe(0);
	});

	it('should be case insensitive for search terms', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [], tags: [] },
			'PIZZA'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(3);
	});

	it('should handle partial word matches in search', () => {
		const result = applyFilters(
			mockRecipes,
			{ cuisines: [], tags: [] },
			'paghet'
		);
		expect(result.length).toBe(1);
		expect(result[0].recipeId).toBe(2);
	});
});
