import { Link, useParams } from 'react-router-dom';
import { Recipe } from '../types';
import './RecipeDetail.css';

interface RecipeDetailProps {
	recipes: Recipe[];
}

const RecipeDetail = ({ recipes }: RecipeDetailProps) => {
	const { id } = useParams<{ id: string }>();
	const recipe = recipes.find((r) => r.recipeId === Number(id));

	if (!recipe) {
		return (
			<div className='recipe-not-found'>
				<h2>Recipe not found</h2>
				<Link to='/' className='back-to-recipes'>
					Back to recipes
				</Link>
			</div>
		);
	}

	// Format time display
	const formatTime = (minutes: number) => {
		if (minutes === 0) return 'None';
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
	};

	return (
		<div className='recipe-detail-container'>
			<Link to='/' className='back-button'>
				← Back to recipes
			</Link>

			<div className='recipe-detail'>
				<div className='recipe-detail-header'>
					<h1>{recipe.recipeName}</h1>
					<div className='recipe-meta'>
						<span className={`difficulty ${recipe.difficulty}`}>
							{recipe.difficulty}
						</span>
						{recipe.vegan && <span className='tag vegan'>Vegan</span>}
						{recipe.vegetarian && (
							<span className='tag vegetarian'>Vegetarian</span>
						)}
					</div>
				</div>

				<div className='recipe-content'>
					<div className='recipe-image-section'>
						<img
							src={recipe.images[0] || '/images/recipe-placeholder.jpg'}
							alt={recipe.recipeName}
							className='detail-image'
						/>

						<div className='recipe-time-info'>
							<div className='time-card'>
								<h4>Prep Time</h4>
								<p>{formatTime(recipe.prepTime)}</p>
							</div>
							<div className='time-card'>
								<h4>Cook Time</h4>
								<p>{formatTime(recipe.cookTime)}</p>
							</div>
							<div className='time-card'>
								<h4>Total Time</h4>
								<p>{formatTime(recipe.totalTime)}</p>
							</div>
							<div className='time-card'>
								<h4>Servings</h4>
								<p>{recipe.servings}</p>
							</div>
						</div>
					</div>

					<div className='recipe-main-content'>
						<section className='recipe-section'>
							<h2>Ingredients</h2>
							<ul className='ingredients-list'>
								{recipe.ingredients.map((item, index) => (
									<li key={index} className={item.optional ? 'optional' : ''}>
										<span className='ingredient-quantity'>
											{item.quantity} {item.measurement.measurementTypeDesc}
										</span>
										<span className='ingredient-name'>
											{item.ingredient.ingredientDesc}
											{item.optional && (
												<span className='optional-label'>(optional)</span>
											)}
										</span>
									</li>
								))}
							</ul>
						</section>

						<section className='recipe-section'>
							<h2>Instructions</h2>
							<ol className='steps-list'>
								{recipe.steps.map((step) => (
									<li key={step.stepNumber}>
										<div className='step-content'>
											<span className='step-number'>{step.stepNumber}</span>
											<p>{step.step}</p>
										</div>
										<span className='step-time'>{step.time} min</span>
									</li>
								))}
							</ol>
						</section>

						<section className='recipe-section'>
							<h2>Nutrition Information</h2>
							<div className='nutrition-info'>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.calories}
									</span>
									<span className='nutrition-label'>Calories</span>
								</div>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.protein}g
									</span>
									<span className='nutrition-label'>Protein</span>
								</div>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.carbs}g
									</span>
									<span className='nutrition-label'>Carbs</span>
								</div>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.fat}g
									</span>
									<span className='nutrition-label'>Fat</span>
								</div>
							</div>
						</section>

						{recipe.tags.length > 0 && (
							<section className='recipe-section'>
								<h2>Tags</h2>
								<div className='recipe-tags'>
									{recipe.tags.map((tag) => (
										<span key={tag} className='recipe-tag'>
											{tag}
										</span>
									))}
								</div>
							</section>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecipeDetail;
