import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// No need for dynamic base path with HashRouter
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<LanguageProvider>
				<HashRouter>
					<App />
				</HashRouter>
			</LanguageProvider>
		</ThemeProvider>
	</React.StrictMode>
);
