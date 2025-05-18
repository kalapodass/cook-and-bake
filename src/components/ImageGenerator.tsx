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
	visible?: boolean; // New prop to control visibility
}

// This component can be included on any page that needs recipe images
// It will automatically generate images and can optionally hide itself after generating
const ImageGenerator = ({
	recipes,
	onImageGenerated = () => {},
	usePlaceholders = false,
	visible = false, // Default to invisible
}: ImageGeneratorProps) => {
	const { t } = useLanguage();
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [generatedImages, setGeneratedImages] = useState<{
		[recipeId: number]: GeneratedImage;
	}>({});
	const [isComplete, setIsComplete] = useState(false);

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
			setIsComplete(true);
		} catch (err) {
			console.error('Error generating images:', err);
			setError('Failed to generate some images.');
		} finally {
			setGenerating(false);
		}
	};

	// If not visible, return null or an empty div
	if (!visible) {
		return null; // Completely hide the component
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
