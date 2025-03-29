export interface Recipe {
	recipeId: number;
	recipeNameEn: string;
	recipeNameGr: string;
	recipeName?: string; // For backwards compatibility
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
	tags: Tag[];
	createdAt: string;
	updatedAt: string;
}

export interface Cuisine {
	cuisineId: number;
	cuisineNameEn: string;
	cuisineNameGr: string;
	cuisineName?: string; // For backwards compatibility
}

export interface Ingredient {
	ingredientId: number;
	ingredientDescEn: string;
	ingredientDescGr: string;
	ingredientDesc?: string; // For backwards compatibility
}

export interface Measurement {
	measurementTypeId: number;
	measurementTypeDescEn: string;
	measurementTypeDescGr: string;
	measurementTypeDesc?: string; // For backwards compatibility
}

export interface RecipeIngredient {
	ingredient: Ingredient;
	measurement: Measurement;
	quantity: number;
	optional: boolean;
}

export interface RecipeStep {
	stepNumber: number;
	stepEn: string;
	stepGr: string;
	step?: string; // For backwards compatibility
	time: number;
}

export interface NutritionalInfo {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface Tag {
	tagEn: string;
	tagGr: string;
}
