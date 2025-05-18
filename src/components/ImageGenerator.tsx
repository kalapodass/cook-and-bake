import { useState } from 'react';
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
	onImageGenerated: (image: GeneratedImage) => void;
}

const ImageGenerator = ({ recipes, onImageGenerated }: ImageGeneratorProps) => {
	const { t, language } = useLanguage();
	const [selectedRecipeId, setSelectedRecipeId] = useState<number | ''>('');
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [preview, setPreview] = useState<GeneratedImage | null>(null);

	const handleGenerate = async () => {
		if (!selectedRecipeId) {
			setError('Please select a recipe');
			return;
		}

		const recipe = recipes.find((r) => r.recipeId === selectedRecipeId);
		if (!recipe) return;

		setGenerating(true);
		setError(null);

		try {
			// For development, you might want to use the placeholder to avoid API costs
			// const generatedImage = getPlaceholderImage(recipe);
			const generatedImage = await generateRecipeImage(recipe);

			setPreview(generatedImage);
			onImageGenerated(generatedImage);
		} catch (err) {
			setError('Failed to generate image. Please try again later.');
			console.error(err);
		} finally {
			setGenerating(false);
		}
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedRecipeId(e.target.value ? Number(e.target.value) : '');
	};

	return (
		<div className='image-generator-container'>
			<h2 className='generator-title'>{t('generator.title')}</h2>
			<p className='generator-description'>{t('generator.description')}</p>

			<div className='generator-form'>
				<div className='form-group'>
					<label htmlFor='recipe-select'>{t('generator.selectRecipe')}</label>
					<select
						id='recipe-select'
						value={selectedRecipeId}
						onChange={handleSelectChange}
						disabled={generating}
					>
						<option value=''>{t('generator.chooseRecipe')}</option>
						{recipes.map((recipe) => (
							<option key={recipe.recipeId} value={recipe.recipeId}>
								{language === 'en' ? recipe.recipeNameEn : recipe.recipeNameGr}
							</option>
						))}
					</select>
				</div>

				<button
					className='generate-button'
					onClick={handleGenerate}
					disabled={generating || !selectedRecipeId}
				>
					{generating
						? t('generator.generating')
						: t('generator.generateImage')}
				</button>
			</div>

			{error && <div className='generator-error'>{error}</div>}

			{preview && (
				<div className='image-preview-container'>
					<h3>{t('generator.preview')}</h3>
					<div className='image-preview'>
						<img src={preview.imageUrl} alt={preview.recipeName} />
					</div>
					<div className='preview-details'>
						<p>
							<strong>{t('generator.prompt')}:</strong> {preview.prompt}
						</p>
						<p>
							<strong>{t('generator.generated')}:</strong>{' '}
							{new Date(preview.createdAt).toLocaleString()}
						</p>
					</div>
					<Link to={`/recipe/${preview.recipeId}`} className='view-recipe-link'>
						{t('generator.viewRecipe')}
					</Link>
				</div>
			)}
		</div>
	);
};

export default ImageGenerator;
