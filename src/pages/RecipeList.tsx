import { useEffect, useState } from 'react';
import ImageGenerator from '../components/ImageGenerator';
import { GeneratedImage } from '../services/imageGenerationService';
import { fetchRecipes } from '../services/recipeService';
import { Recipe } from '../types';

const RecipeList = () => {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [imagesGenerated, setImagesGenerated] = useState<{
		[key: number]: string;
	}>({});

	useEffect(() => {
		const loadRecipes = async () => {
			const data = await fetchRecipes();
			setRecipes(data);
		};

		loadRecipes();
	}, []);

	const handleImageGenerated = (image: GeneratedImage) => {
		setImagesGenerated((prev) => ({
			...prev,
			[image.recipeId]: image.imageUrl,
		}));
	};

	return (
		<div className='recipe-list-page'>
			{/* This will automatically generate images and hide itself when done */}
			<ImageGenerator
				recipes={recipes}
				onImageGenerated={handleImageGenerated}
				autoHide={true}
				usePlaceholders={import.meta.env.DEV} // Use placeholders in dev mode
			/>

			<div className='recipe-cards'>
				{recipes.map((recipe) => (
					<div key={recipe.recipeId} className='recipe-card'>
						{imagesGenerated[recipe.recipeId] && (
							<img
								src={imagesGenerated[recipe.recipeId]}
								alt={recipe.recipeNameEn}
							/>
						)}
						<h3>{recipe.recipeNameEn}</h3>
						{/* ...other recipe details... */}
					</div>
				))}
			</div>
		</div>
	);
};

export default RecipeList;
