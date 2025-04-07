import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className='theme-toggle'
			onClick={toggleTheme}
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			{theme === 'light' ? '🌙' : '☀️'}
		</button>
	);
};

export default ThemeToggle;
