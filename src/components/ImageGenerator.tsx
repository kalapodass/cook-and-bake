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
	visible?: boolean; // Control UI visibility only, not functionality
	autoHide?: boolean; // Auto hide after completion
}

// This component can be included on any page that needs recipe images
// It will automatically generate images and functions regardless of visibility
const ImageGenerator = ({
	recipes,
	onImageGenerated = () => {},
	usePlaceholders = false,
	visible = false, // Default to visible for backward compatibility
	autoHide = true,
}: ImageGeneratorProps) => {
	const { t } = useLanguage();
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [generatedImages, setGeneratedImages] = useState<{
		[recipeId: number]: GeneratedImage;
	}>({});

	// Computed property for completion status
	const isComplete =
		recipes.length > 0 && Object.keys(generatedImages).length >= recipes.length;

	// Generate images when component mounts or recipes change
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

	// Even when not visible, the component will still generate images
	// Only the UI rendering is affected by the visible prop

	// If autoHide is true and generation is complete, don't render UI
	const shouldHideUI = (autoHide && isComplete && !generating) || !visible;

	// Always return something to ensure the component can re-render
	// but hide the UI elements when shouldHideUI is true
	return (
		<div
			className='image-generator-container'
			style={{
				display: shouldHideUI ? 'none' : 'block',
			}}
		>
			{generating && (
				<div className='generating-status'>
					<p>{t('generator.generating') || 'Generating recipe images...'}</p>
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
