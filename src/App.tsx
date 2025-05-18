import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import ImageGenerator from './components/ImageGenerator';
import LanguageToggle from './components/LanguageToggle';
import RecipeDetail from './components/RecipeDetail';
import RecipeGrid from './components/RecipeGrid';
import ThemeToggle from './components/ThemeToggle';
import { useLanguage } from './context/LanguageContext';
import useAnalytics from './hooks/useAnalytics';
import { GeneratedImage } from './services/imageGenerationService';
import { fetchRecipes } from './services/recipeService';
import { Recipe } from './types';

function App() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
	const { t } = useLanguage();

	// Initialize analytics tracking
	useAnalytics();

	useEffect(() => {
		const loadRecipes = async () => {
			try {
				setLoading(true);
				const data = await fetchRecipes();
				setRecipes(data);
				setError(null);
			} catch (err) {
				setError('Failed to load recipes');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadRecipes();

		// Load previously generated images from localStorage if available
		const savedImages = localStorage.getItem('generatedImages');
		if (savedImages) {
			try {
				setGeneratedImages(JSON.parse(savedImages));
			} catch (err) {
				console.error('Failed to load saved images', err);
			}
		}
	}, []);

	// Save generated images to localStorage when updated
	useEffect(() => {
		if (generatedImages.length > 0) {
			localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
		}
	}, [generatedImages]);

	const handleImageGenerated = (image: GeneratedImage) => {
		setGeneratedImages((prev) => {
			// Replace if same recipe, otherwise add
			const exists = prev.findIndex((img) => img.recipeId === image.recipeId);
			if (exists >= 0) {
				const updated = [...prev];
				updated[exists] = image;
				return updated;
			}
			return [...prev, image];
		});

		// Also update the recipe with the new image
		setRecipes((prev) => {
			return prev.map((recipe) => {
				if (recipe.recipeId === image.recipeId) {
					// Add the new image to the beginning of the images array
					const updatedImages = [image.imageUrl, ...recipe.images];
					return { ...recipe, images: updatedImages };
				}
				return recipe;
			});
		});
	};

	if (loading) {
		return <div className='loading'>Loading recipes...</div>;
	}

	if (error) {
		return <div className='error'>{error}</div>;
	}

	return (
		<>
			<div className='app-header'>
				<ThemeToggle />
				<LanguageToggle />
				<nav className='app-nav'>
					<Link to='/' className='nav-link'>
						{t('nav.home')}
					</Link>
				</nav>
			</div>

			<Routes>
				<Route
					path='/'
					element={
						recipes.length > 0 ? (
							<RecipeGrid recipes={recipes} />
						) : (
							<div className='no-recipes'>No recipes found</div>
						)
					}
				/>
				<Route
					path='/recipe/:id'
					element={<RecipeDetail recipes={recipes} />}
				/>
			</Routes>

			{/* Integrate ImageGenerator component directly into the app layout */}
			<ImageGenerator
				recipes={recipes}
				onImageGenerated={handleImageGenerated}
			/>
		</>
	);
}

export default App;
