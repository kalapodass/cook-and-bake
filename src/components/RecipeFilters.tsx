import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
	FilterOptions,
	extractCuisines,
	extractTags,
} from '../services/filterService';
import { Recipe } from '../types';
import './RecipeFilters.css';

interface RecipeFiltersProps {
	recipes: Recipe[];
	onFilterChange: (filters: FilterOptions) => void;
	filteredCount?: number; // Add prop for filtered count
}

interface CuisineOption {
	id: number;
	nameEn: string;
	nameGr: string;
}

interface TagOption {
	tagEn: string;
	tagGr: string;
}

const RecipeFilters = ({
	recipes,
	onFilterChange,
	filteredCount,
}: RecipeFiltersProps) => {
	const { language, t } = useLanguage();
	const [cuisines, setCuisines] = useState<CuisineOption[]>([]);
	const [tags, setTags] = useState<TagOption[]>([]);
	const [selectedCuisines, setSelectedCuisines] = useState<number[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);

	// Extract cuisines and tags when recipes change
	useEffect(() => {
		const allCuisines = extractCuisines(recipes);
		const allTags = extractTags(recipes);

		setCuisines(allCuisines);
		setTags(allTags);
	}, [recipes]);

	// Update parent component when filters change
	useEffect(() => {
		onFilterChange({
			cuisines: selectedCuisines,
			tags: selectedTags,
		});
	}, [selectedCuisines, selectedTags, onFilterChange]);

	const handleCuisineChange = (cuisineId: number) => {
		setSelectedCuisines((prev) => {
			// If already selected, remove it; otherwise, add it
			if (prev.includes(cuisineId)) {
				return prev.filter((id) => id !== cuisineId);
			} else {
				return [...prev, cuisineId];
			}
		});
	};

	const handleTagChange = (tag: string) => {
		setSelectedTags((prev) => {
			// If already selected, remove it; otherwise, add it
			if (prev.includes(tag)) {
				return prev.filter((t) => t !== tag);
			} else {
				return [...prev, tag];
			}
		});
	};

	const clearFilters = () => {
		setSelectedCuisines([]);
		setSelectedTags([]);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	// Determine if any filters are active
	const hasActiveFilters =
		selectedCuisines.length > 0 || selectedTags.length > 0;

	return (
		<div className='recipe-filters'>
			<div className='filter-header' onClick={toggleExpand}>
				<h3>{t('filters.title') || 'Filter Recipes'}</h3>
				<div className='filter-summary'>
					{hasActiveFilters && (
						<span className='filter-badge'>
							{selectedCuisines.length + selectedTags.length}
						</span>
					)}
					<button className='expand-button'>{isExpanded ? '▲' : '▼'}</button>
				</div>
			</div>

			{filteredCount !== undefined && hasActiveFilters && (
				<div className='filtered-count'>
					{t('filters.showing', {
						count: filteredCount,
						total: recipes.length,
					}) || `Showing ${filteredCount} of ${recipes.length} recipes`}
				</div>
			)}

			{(isExpanded || hasActiveFilters) && (
				<>
					{hasActiveFilters && (
						<div className='active-filters'>
							<span className='active-filters-label'>
								{t('filters.active') || 'Active filters:'}
							</span>
							<div className='active-filters-list'>
								{selectedCuisines.map((cuisineId) => {
									const cuisine = cuisines.find((c) => c.id === cuisineId);
									if (!cuisine) return null;
									return (
										<span
											key={`active-cuisine-${cuisineId}`}
											className='active-filter'
										>
											{language === 'en' ? cuisine.nameEn : cuisine.nameGr}
											<button
												className='remove-filter'
												onClick={() => handleCuisineChange(cuisineId)}
											>
												×
											</button>
										</span>
									);
								})}

								{selectedTags.map((tagName) => {
									const tag = tags.find((t) => t.tagEn === tagName);
									if (!tag) return null;
									return (
										<span
											key={`active-tag-${tagName}`}
											className='active-filter'
										>
											{language === 'en' ? tag.tagEn : tag.tagGr}
											<button
												className='remove-filter'
												onClick={() => handleTagChange(tagName)}
											>
												×
											</button>
										</span>
									);
								})}
							</div>
						</div>
					)}

					<div className='filter-section'>
						<h4>{t('filters.cuisines') || 'Cuisines'}</h4>
						<div className='filter-options'>
							{cuisines.map((cuisine) => (
								<label
									key={cuisine.id}
									className={`filter-option ${
										selectedCuisines.includes(cuisine.id) ? 'active' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={selectedCuisines.includes(cuisine.id)}
										onChange={() => handleCuisineChange(cuisine.id)}
									/>
									{language === 'en' ? cuisine.nameEn : cuisine.nameGr}
								</label>
							))}
						</div>
					</div>

					<div className='filter-section'>
						<h4>{t('filters.tags') || 'Tags'}</h4>
						<div className='filter-options'>
							{tags.map((tag) => (
								<label
									key={tag.tagEn}
									className={`filter-option ${
										selectedTags.includes(tag.tagEn) ? 'active' : ''
									}`}
								>
									<input
										type='checkbox'
										checked={selectedTags.includes(tag.tagEn)}
										onChange={() => handleTagChange(tag.tagEn)}
									/>
									{language === 'en' ? tag.tagEn : tag.tagGr}
								</label>
							))}
						</div>
					</div>

					{hasActiveFilters && (
						<button
							type='button'
							className='clear-filters'
							onClick={clearFilters}
						>
							{t('filters.clear') || 'Clear Filters'}
						</button>
					)}
				</>
			)}
		</div>
	);
};

export default RecipeFilters;
