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
	visible?: boolean; // Control visibility
	autoHide?: boolean; // Add the missing property
}

// This component can be included on any page that needs recipe images
// It will automatically generate images and can optionally hide itself after generating
const ImageGenerator = ({
	recipes,
	onImageGenerated = () => {},
	usePlaceholders = false,
	visible = false,
	autoHide = false,
}: ImageGeneratorProps) => {
	const { t } = useLanguage();
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [generatedImages, setGeneratedImages] = useState<{
		[recipeId: number]: GeneratedImage;
	}>({});
	const isComplete =
		recipes.length > 0 && Object.keys(generatedImages).length >= recipes.length;

	// Auto-generate images when component mounts or recipes change
	useEffect(() => {
		if (recipes.length > 0) {
			generateAllImages();
		}
	}, [recipes]);

	// Function to generate images for all recipes
	const generateAllImages = async () => {
		// Skip if already generating
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
			}

			setGeneratedImages((prev) => ({ ...prev, ...images }));
		} catch (err) {
			console.error('Error generating images:', err);
			setError('Failed to generate some images.');
		} finally {
			setGenerating(false);
		}
	};

	// If autoHide is true and we're done generating, don't render anything
	if (autoHide && isComplete && !generating) {
		return null;
	}

	// If not visible, return null
	if (!visible) {
		return null;
	}

	return (
		<div className='image-generator-container'>
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

			{Object.keys(generatedImages).length > 0 && (
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
			)}
		</div>
	);
};

export default ImageGenerator;
