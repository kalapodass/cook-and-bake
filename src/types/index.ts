export interface Recipe {
	recipeId: number;
	recipeName: string;
	prepTime: number;
	cookTime: number;
	totalTime: number;
	servings: number;
	vegan: boolean;
	vegetarian: boolean;
	difficulty: 'easy' | 'medium' | 'hard';
	images: string[];
	cuisines: Cuisine[];
	ingredients: RecipeIngredient[];
	steps: RecipeStep[];
	nutritionalInfo: NutritionalInfo;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Cuisine {
	cuisineId: number;
	cuisineName: string;
}

export interface Ingredient {
	ingredientId: number;
	ingredientDesc: string;
}

export interface Measurement {
	measurementTypeId: number;
	measurementTypeDesc: string;
}

export interface RecipeIngredient {
	ingredient: Ingredient;
	measurement: Measurement;
	quantity: number;
	optional: boolean;
}

export interface RecipeStep {
	stepNumber: number;
	step: string;
	time: number;
}

export interface NutritionalInfo {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}
