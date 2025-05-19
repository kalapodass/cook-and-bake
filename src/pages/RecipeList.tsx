import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageGenerator from '../components/ImageGenerator';
import RecipeFilters from '../components/RecipeFilters';
import { useLanguage } from '../context/LanguageContext';
import { FilterOptions, filterRecipes } from '../services/filterService';
import { GeneratedImage } from '../services/imageGenerationService';
import { fetchRecipes } from '../services/recipeService';
import { Recipe } from '../types';
import './RecipeList.css';

const RecipeList = () => {
	const { t, language } = useLanguage();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
	const [imagesGenerated, setImagesGenerated] = useState<{
		[key: number]: string;
	}>({});
	const [loading, setLoading] = useState<boolean>(true);

	// Load recipes on component mount
	useEffect(() => {
		const loadRecipes = async () => {
			setLoading(true);
			try {
				const data = await fetchRecipes();
				setRecipes(data);
				setFilteredRecipes(data); // Initially, filtered recipes = all recipes
			} catch (error) {
				console.error('Error fetching recipes:', error);
			} finally {
				setLoading(false);
			}
		};

		loadRecipes();
	}, []);

	// Handle image generation
	const handleImageGenerated = (image: GeneratedImage) => {
		setImagesGenerated((prev) => ({
			...prev,
			[image.recipeId]: image.imageUrl,
		}));
	};

	// Handle filter changes
	const handleFilterChange = (filters: FilterOptions) => {
		const filtered = filterRecipes(recipes, filters);
		setFilteredRecipes(filtered);
	};

	return (
		<div className='recipe-list-page'>
			<h1>{t('app.recipeListTitle') || 'Our Recipes'}</h1>

			{/* This will automatically generate images in the background */}
			<ImageGenerator
				recipes={recipes}
				onImageGenerated={handleImageGenerated}
				autoHide={true}
				visible={false}
			/>

			{/* Recipe filters */}
			<RecipeFilters recipes={recipes} onFilterChange={handleFilterChange} />

			{loading ? (
				<div className='loading'>
					{t('app.loading') || 'Loading recipes...'}
				</div>
			) : filteredRecipes.length === 0 ? (
				<div className='no-results'>
					{t('filters.noResults') || 'No recipes match your filters'}
				</div>
			) : (
				<div className='recipe-grid'>
					{filteredRecipes.map((recipe) => (
						<Link
							to={`/recipe/${recipe.recipeId}`}
							className='recipe-card'
							key={recipe.recipeId}
						>
							<div className='recipe-image'>
								{imagesGenerated[recipe.recipeId] ? (
									<img
										src={imagesGenerated[recipe.recipeId]}
										alt={
											language === 'en'
												? recipe.recipeNameEn
												: recipe.recipeNameGr
										}
									/>
								) : (
									<div className='placeholder-image'></div>
								)}
							</div>
							<h3>
								{language === 'en' ? recipe.recipeNameEn : recipe.recipeNameGr}
							</h3>
							<div className='recipe-meta'>
								<span className='prep-time'>
									{recipe.prepTime} {t('recipe.minutes')}
								</span>
								<span className='difficulty'>
									{t(`difficulty.${recipe.difficulty}`) || recipe.difficulty}
								</span>
							</div>
							<div className='recipe-tags'>
								{recipe.tags.slice(0, 3).map((tag) => (
									<span key={tag.tagEn} className='tag'>
										{language === 'en' ? tag.tagEn : tag.tagGr}
									</span>
								))}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default RecipeList;
