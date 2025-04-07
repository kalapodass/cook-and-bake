import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LanguageToggle from './components/LanguageToggle';
import RecipeDetail from './components/RecipeDetail';
import RecipeGrid from './components/RecipeGrid';
import ThemeToggle from './components/ThemeToggle';
import { fetchRecipes } from './services/recipeService';
import { Recipe } from './types';

function App() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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
	}, []);

	if (loading) {
		return <div className='loading'>Loading recipes...</div>;
	}

	if (error) {
		return <div className='error'>{error}</div>;
	}

	return (
		<>
			<ThemeToggle />
			<LanguageToggle />
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
		</>
	);
}

export default App;
