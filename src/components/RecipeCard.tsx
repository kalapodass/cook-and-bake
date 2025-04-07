import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Recipe } from '../types';
import './RecipeCard.css';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
	const {
		recipeId,
		recipeNameEn,
		recipeNameGr,
		prepTime,
		cookTime,
		totalTime,
		difficulty,
		images,
	} = recipe;

	const { language, t } = useLanguage();

	// Use the recipe name based on the selected language
	const recipeName = language === 'en' ? recipeNameEn : recipeNameGr;

	// Use the first image or a placeholder
	const imageUrl =
		images && images.length > 0 ? images[0] : '/images/recipe-placeholder.jpg';

	// Format time display
	const formatTime = (minutes: number) => {
		if (minutes === 0) return 'None';
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
	};

	// Get appropriate difficulty badge class
	const getDifficultyClass = (level: string) => {
		switch (level) {
			case 'easy':
				return 'badge-success';
			case 'medium':
				return 'badge-warning';
			case 'hard':
				return 'badge-danger';
			default:
				return 'badge-secondary';
		}
	};

	return (
		<div className='recipe-card'>
			<Link to={`/recipe/${recipeId}`} className='recipe-link'>
				<div className='recipe-image-container'>
					<img src={imageUrl} alt={recipeName} className='recipe-image' />
					<span
						className={`difficulty-badge ${getDifficultyClass(difficulty)}`}
					>
						{t(`difficulty.${difficulty}`)}
					</span>
				</div>

				<div className='recipe-info'>
					<h3 className='recipe-title'>{recipeName}</h3>

					<div className='recipe-times'>
						<div className='time-item'>
							<span className='time-label'>{t('recipe.prepTime')}</span>
							<span className='time-value'>{formatTime(prepTime)}</span>
						</div>
						<div className='time-item'>
							<span className='time-label'>{t('recipe.cookTime')}</span>
							<span className='time-value'>{formatTime(cookTime)}</span>
						</div>
						<div className='time-item'>
							<span className='time-label'>{t('recipe.totalTime')}</span>
							<span className='time-value'>{formatTime(totalTime)}</span>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default RecipeCard;
