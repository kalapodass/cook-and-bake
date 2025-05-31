import { useCallback, useEffect, useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi'; // Import icons
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
	const [searchTerm, setSearchTerm] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
		cuisines: [],
		tags: [],
	});

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

	// Apply both text search and filters
	const applyFilters = useCallback(
		(filters: FilterOptions, search: string) => {
			// First apply category/tag filters
			let filtered = filterRecipes(recipes, filters);

			// Then apply search term if present
			if (search.trim()) {
				const searchLower = search.toLowerCase();
				filtered = filtered.filter(
					(recipe) =>
						recipe.recipeNameEn.toLowerCase().includes(searchLower) ||
						recipe.recipeNameGr.toLowerCase().includes(searchLower)
				);
			}

			setFilteredRecipes(filtered);
			setCurrentFilters(filters);
		},
		[recipes]
	);

	// Handle filter changes from RecipeFilters component
	const handleFilterChange = useCallback(
		(filters: FilterOptions) => {
			applyFilters(filters, searchTerm);
		},
		[applyFilters, searchTerm]
	);

	// Handle search input changes
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = e.target.value;
		setSearchTerm(newSearchTerm);
		applyFilters(currentFilters, newSearchTerm);
	};

	// Toggle filter visibility
	const toggleFilters = () => {
		setShowFilters((prev) => !prev);
	};

	return (
		<div className='recipe-list-page'>
			<h1>{t('app.recipeListTitle') || 'Our Recipes'}</h1>

			{/* This will automatically generate images in the background */}
			<ImageGenerator
				recipes={recipes}
				onImageGenerated={handleImageGenerated}
				autoHide={true}
			/>

			{/* Search and filter controls */}
			{!loading && (
				<div className='search-filter-container'>
					<div className='search-box'>
						<FiSearch className='search-icon' />
						<input
							type='text'
							placeholder={t('search.placeholder') || 'Search recipes...'}
							value={searchTerm}
							onChange={handleSearchChange}
							aria-label={t('search.ariaLabel') || 'Search recipes'}
						/>
						<button
							className={`filter-toggle-btn ${
								currentFilters.cuisines.length > 0 ||
								currentFilters.tags.length > 0
									? 'has-filters'
									: ''
							}`}
							onClick={toggleFilters}
							aria-label={t('filters.toggleFilters') || 'Toggle filters'}
							type='button'
						>
							<FiFilter />
							{(currentFilters.cuisines.length > 0 ||
								currentFilters.tags.length > 0) && (
								<span className='filter-count-badge'>
									{currentFilters.cuisines.length + currentFilters.tags.length}
								</span>
							)}
						</button>
					</div>

					{/* Show filter count if filters are active but hidden */}
					{!showFilters &&
						(currentFilters.cuisines.length > 0 ||
							currentFilters.tags.length > 0) && (
							<div className='filter-summary-bar'>
								{t('filters.active') ||
									`${
										currentFilters.cuisines.length + currentFilters.tags.length
									} active filters`}
								<button
									onClick={() => {
										setCurrentFilters({ cuisines: [], tags: [] });
										applyFilters({ cuisines: [], tags: [] }, searchTerm);
									}}
									className='reset-filters-btn'
									type='button'
								>
									{t('filters.clear') || 'Clear'}
								</button>
							</div>
						)}

					{/* Recipe filters component */}
					{showFilters && (
						<RecipeFilters
							recipes={recipes}
							onFilterChange={handleFilterChange}
							filteredCount={filteredRecipes.length}
						/>
					)}
				</div>
			)}

			{loading ? (
				<div className='loading'>
					{t('app.loading') || 'Loading recipes...'}
				</div>
			) : filteredRecipes.length === 0 ? (
				<div className='no-results'>
					{t('filters.noResults') || 'No recipes match your filters'}
				</div>
			) : (
				<>
					<div className='results-count'>
						{t('search.results') || `${filteredRecipes.length} recipes found`} (
						{filteredRecipes.length})
					</div>
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
									{language === 'en'
										? recipe.recipeNameEn
										: recipe.recipeNameGr}
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
				</>
			)}
		</div>
	);
};

export default RecipeList;
