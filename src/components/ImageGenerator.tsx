import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
	GeneratedImage,
	generateRecipeImage,
	getPlaceholderImage,
} from '../services/imageGenerationService';
import { Recipe } from '../types';
import './ImageGenerator.css';

interface ImageGeneratorProps {
	recipes: Recipe[];
	onImageGenerated?: (image: GeneratedImage) => void;
	usePlaceholders?: boolean;
}

const ImageGenerator = ({
	recipes,
	onImageGenerated = () => {},
	usePlaceholders = false,
}: ImageGeneratorProps) => {
	const { t } = useLanguage();
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [generatedImages, setGeneratedImages] = useState<{
		[recipeId: number]: GeneratedImage;
	}>({});

	// Auto-generate images when component mounts or recipes change
	useEffect(() => {
		generateAllImages();
	}, [recipes]);

	// Function to generate images for all recipes
	const generateAllImages = async () => {
		if (generating || !recipes.length) return;

		setGenerating(true);
		const images: { [recipeId: number]: GeneratedImage } = {};

		try {
			for (const recipe of recipes) {
				// Skip if we already have this image
				if (generatedImages[recipe.recipeId]) continue;

				let image;
				if (usePlaceholders) {
					image = getPlaceholderImage(recipe);
				} else {
					image = await generateRecipeImage(recipe);
				}

				images[recipe.recipeId] = image;
				onImageGenerated(image);

				// Small delay to avoid overwhelming the API
				if (!usePlaceholders) {
					await new Promise((resolve) => setTimeout(resolve, 500));
				}
			}

			setGeneratedImages((prev) => ({ ...prev, ...images }));
		} catch (err) {
			console.error('Error generating images:', err);
			setError('Failed to generate some images. Please try again later.');
		} finally {
			setGenerating(false);
		}
	};

	return (
		<div className='image-generator-container'>
			<h2 className='generator-title'>{t('generator.title')}</h2>

			{generating && (
				<div className='generating-status'>
					<p>
						{t('generator.generatingImages') || 'Generating recipe images...'}
					</p>
					<progress
						value={Object.keys(generatedImages).length}
						max={recipes.length}
					/>
				</div>
			)}

			{error && <div className='generator-error'>{error}</div>}

			<div className='image-grid'>
				{Object.values(generatedImages).map((image) => (
					<div key={image.recipeId} className='recipe-image-card'>
						<img src={image.imageUrl} alt={image.recipeName} />
						<Link to={`/recipe/${image.recipeId}`} className='recipe-link'>
							{image.recipeName}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default ImageGenerator;
