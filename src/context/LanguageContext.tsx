import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

type Language = 'en' | 'gr';

interface LanguageContextType {
	language: Language;
	toggleLanguage: () => void;
	t: (key: string) => string;
}

const translations = {
	en: {
		'app.title': 'Our Recipes',
		'recipe.prepTime': 'Prep Time',
		'recipe.cookTime': 'Cook Time',
		'recipe.totalTime': 'Total Time',
		'recipe.servings': 'Servings',
		'recipe.ingredients': 'Ingredients',
		'recipe.instructions': 'Instructions',
		'recipe.nutrition': 'Nutrition Information',
		'recipe.tags': 'Tags',
		'recipe.backToRecipes': 'Back to recipes',
		'recipe.difficulty': 'Difficulty',
		'recipe.notFound': 'Recipe not found',
		'recipe.calories': 'Calories',
		'recipe.protein': 'Protein',
		'recipe.carbs': 'Carbs',
		'recipe.fat': 'Fat',
		'difficulty.easy': 'Easy',
		'difficulty.medium': 'Medium',
		'difficulty.hard': 'Hard',
		'diet.vegan': 'Vegan',
		'diet.vegetarian': 'Vegetarian',
	},
	gr: {
		'app.title': 'Οι Συνταγές μας',
		'recipe.prepTime': 'Χρόνος Προετοιμασίας',
		'recipe.cookTime': 'Χρόνος Μαγειρέματος',
		'recipe.totalTime': 'Συνολικός Χρόνος',
		'recipe.servings': 'Μερίδες',
		'recipe.ingredients': 'Υλικά',
		'recipe.instructions': 'Οδηγίες',
		'recipe.nutrition': 'Διατροφικές Πληροφορίες',
		'recipe.tags': 'Ετικέτες',
		'recipe.backToRecipes': 'Πίσω στις συνταγές',
		'recipe.difficulty': 'Δυσκολία',
		'recipe.notFound': 'Η συνταγή δεν βρέθηκε',
		'recipe.calories': 'Θερμίδες',
		'recipe.protein': 'Πρωτεΐνη',
		'recipe.carbs': 'Υδατάνθρακες',
		'recipe.fat': 'Λίπος',
		'difficulty.easy': 'Εύκολο',
		'difficulty.medium': 'Μέτριο',
		'difficulty.hard': 'Δύσκολο',
		'diet.vegan': 'Βίγκαν',
		'diet.vegetarian': 'Χορτοφαγικό',
	},
};

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
	// Check localStorage for saved language or use browser language
	const getInitialLanguage = (): Language => {
		const savedLanguage = localStorage.getItem('language') as Language;
		if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'gr')) {
			return savedLanguage;
		}

		// Check browser language
		const browserLang = navigator.language.substring(0, 2);
		return browserLang === 'el' ? 'gr' : 'en';
	};

	const [language, setLanguage] = useState<Language>(getInitialLanguage);

	// Toggle language function
	const toggleLanguage = () => {
		setLanguage((prevLanguage) => {
			const newLanguage = prevLanguage === 'en' ? 'gr' : 'en';
			localStorage.setItem('language', newLanguage);
			return newLanguage;
		});
	};

	// Translation function
	const t = (key: string): string => {
		return (
			translations[language][
				key as keyof (typeof translations)[typeof language]
			] || key
		);
	};

	// Set language attribute on document
	useEffect(() => {
		document.documentElement.setAttribute('lang', language);
	}, [language]);

	return (
		<LanguageContext.Provider value={{ language, toggleLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

// Custom hook to use the language context
export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
}
