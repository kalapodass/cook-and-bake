import { FC } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import './RecipeGrid.css';

interface RecipeGridProps {
	recipes: Recipe[];
}

const RecipeGrid: FC<RecipeGridProps> = ({ recipes }) => {
	const { t } = useLanguage();

	return (
		<div className='recipe-grid-container'>
			<h2 className='recipes-heading'>{t('app.title')}</h2>
			<div className='recipe-grid'>
				{recipes.map((recipe) => (
					<RecipeCard key={recipe.recipeId} recipe={recipe} />
				))}
			</div>
		</div>
	);
};

export default RecipeGrid;
