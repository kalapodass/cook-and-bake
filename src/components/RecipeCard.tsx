import { Link } from 'react-router-dom';
import { Recipe } from '../types';
import './RecipeCard.css';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
	const {
		recipeId,
		recipeName,
		prepTime,
		cookTime,
		totalTime,
		difficulty,
		images,
	} = recipe;

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
						{difficulty}
					</span>
				</div>

				<div className='recipe-info'>
					<h3 className='recipe-title'>{recipeName}</h3>

					<div className='recipe-times'>
						<div className='time-item'>
							<span className='time-label'>Prep</span>
							<span className='time-value'>{formatTime(prepTime)}</span>
						</div>
						<div className='time-item'>
							<span className='time-label'>Cook</span>
							<span className='time-value'>{formatTime(cookTime)}</span>
						</div>
						<div className='time-item'>
							<span className='time-label'>Total</span>
							<span className='time-value'>{formatTime(totalTime)}</span>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default RecipeCard;
