import { useLanguage } from '../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
	const { language, toggleLanguage } = useLanguage();

	return (
		<button
			className='language-toggle'
			onClick={toggleLanguage}
			aria-label={`Switch to ${
				language === 'en' ? 'Greek' : 'English'
			} language`}
		>
			{language === 'en' ? '🇬🇷' : '🇬🇧'}
		</button>
	);
};

export default LanguageToggle;
