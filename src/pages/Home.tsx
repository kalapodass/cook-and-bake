import { useEffect, useState } from 'react';
import ImageGenerator from '../components/ImageGenerator';
import { GeneratedImage } from '../services/imageGenerationService';
import { fetchRecipes } from '../services/recipeService';
import { Recipe } from '../types';

const Home = () => {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [imageMap, setImageMap] = useState<{ [key: number]: string }>({});

	useEffect(() => {
		const loadRecipes = async () => {
			const data = await fetchRecipes();
			setRecipes(data);
		};

		loadRecipes();
	}, []);

	const handleImageGenerated = (image: GeneratedImage) => {
		setImageMap((prev) => ({
			...prev,
			[image.recipeId]: image.imageUrl,
		}));
	};

	return (
		<div className='home-page'>
			{/* Hidden component that auto-generates images */}
			<div style={{ display: 'none' }}>
				<ImageGenerator
					recipes={recipes}
					onImageGenerated={handleImageGenerated}
					usePlaceholders={import.meta.env.DEV} // Use placeholders in dev mode
				/>
			</div>

			{/* Your regular page content */}
			{/* ...existing code... */}

			{/* Use the generated images in your recipe list */}
			<div className='recipe-list'>
				{recipes.map((recipe) => (
					<div key={recipe.recipeId} className='recipe-card'>
						{imageMap[recipe.recipeId] && (
							<img
								src={imageMap[recipe.recipeId]}
								alt={recipe.recipeNameEn || recipe.recipeNameGr}
								className='recipe-image'
							/>
						)}
						<h3>{recipe.recipeNameEn || recipe.recipeNameGr}</h3>
						{/* ...other recipe details... */}
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
