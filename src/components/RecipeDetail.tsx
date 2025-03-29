import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Recipe } from '../types';
import './RecipeDetail.css';

interface RecipeDetailProps {
	recipes: Recipe[];
}

const RecipeDetail = ({ recipes }: RecipeDetailProps) => {
	const { id } = useParams<{ id: string }>();
	const recipe = recipes.find((r) => r.recipeId === Number(id));
	const { language, t } = useLanguage();

	if (!recipe) {
		return (
			<div className='recipe-not-found'>
				<h2>{t('recipe.notFound')}</h2>
				<Link to='/' className='back-to-recipes'>
					{t('recipe.backToRecipes')}
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

	// Get the recipe name based on the current language
	const recipeName =
		language === 'en' ? recipe.recipeNameEn : recipe.recipeNameGr;

	// Get difficulty text based on language
	const getDifficultyText = (difficulty: string) => {
		return t(`difficulty.${difficulty}`);
	};

	return (
		<div className='recipe-detail-container'>
			<Link to='/' className='back-button'>
				← {t('recipe.backToRecipes')}
			</Link>

			<div className='recipe-detail'>
				<div className='recipe-detail-header'>
					<h1>{recipeName}</h1>
					<div className='recipe-meta'>
						<span className={`difficulty ${recipe.difficulty}`}>
							{getDifficultyText(recipe.difficulty)}
						</span>
						{recipe.vegan && (
							<span className='tag vegan'>{t('diet.vegan')}</span>
						)}
						{recipe.vegetarian && (
							<span className='tag vegetarian'>{t('diet.vegetarian')}</span>
						)}
					</div>
				</div>

				<div className='recipe-content'>
					<div className='recipe-image-section'>
						<img
							src={recipe.images[0] || '/images/recipe-placeholder.jpg'}
							alt={recipeName}
							className='detail-image'
						/>

						<div className='recipe-time-info'>
							<div className='time-card'>
								<h4>{t('recipe.prepTime')}</h4>
								<p>{formatTime(recipe.prepTime)}</p>
							</div>
							<div className='time-card'>
								<h4>{t('recipe.cookTime')}</h4>
								<p>{formatTime(recipe.cookTime)}</p>
							</div>
							<div className='time-card'>
								<h4>{t('recipe.totalTime')}</h4>
								<p>{formatTime(recipe.totalTime)}</p>
							</div>
							<div className='time-card'>
								<h4>{t('recipe.servings')}</h4>
								<p>{recipe.servings}</p>
							</div>
						</div>
					</div>

					<div className='recipe-main-content'>
						<section className='recipe-section'>
							<h2>{t('recipe.ingredients')}</h2>
							<ul className='ingredients-list'>
								{recipe.ingredients.map((item, index) => (
									<li key={index} className={item.optional ? 'optional' : ''}>
										<span className='ingredient-quantity'>
											{item.quantity}{' '}
											{language === 'en'
												? item.measurement.measurementTypeDescEn
												: item.measurement.measurementTypeDescGr ||
												  item.measurement.measurementTypeDesc}
										</span>
										<span className='ingredient-name'>
											{language === 'en'
												? item.ingredient.ingredientDescEn
												: item.ingredient.ingredientDescGr ||
												  item.ingredient.ingredientDesc}
											{item.optional && (
												<span className='optional-label'>(optional)</span>
											)}
										</span>
									</li>
								))}
							</ul>
						</section>

						<section className='recipe-section'>
							<h2>{t('recipe.instructions')}</h2>
							<ol className='steps-list'>
								{recipe.steps.map((step) => (
									<li key={step.stepNumber}>
										<div className='step-content'>
											<span className='step-number'>{step.stepNumber}</span>
											<p>
												{language === 'en'
													? step.stepEn
													: step.stepGr || step.step}
											</p>
										</div>
										<span className='step-time'>{step.time} min</span>
									</li>
								))}
							</ol>
						</section>

						<section className='recipe-section'>
							<h2>{t('recipe.nutrition')}</h2>
							<div className='nutrition-info'>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.calories}
									</span>
									<span className='nutrition-label'>
										{t('recipe.calories')}
									</span>
								</div>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.protein}g
									</span>
									<span className='nutrition-label'>{t('recipe.protein')}</span>
								</div>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.carbs}g
									</span>
									<span className='nutrition-label'>{t('recipe.carbs')}</span>
								</div>
								<div className='nutrition-item'>
									<span className='nutrition-value'>
										{recipe.nutritionalInfo.fat}g
									</span>
									<span className='nutrition-label'>{t('recipe.fat')}</span>
								</div>
							</div>
						</section>

						{recipe.tags.length > 0 && (
							<section className='recipe-section'>
								<h2>{t('recipe.tags')}</h2>
								<div className='recipe-tags'>
									{recipe.tags.map((tag) => (
										<span
											key={language === 'en' ? tag.tagEn : tag.tagGr}
											className='recipe-tag'
										>
											{language === 'en' ? tag.tagEn : tag.tagGr}
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
