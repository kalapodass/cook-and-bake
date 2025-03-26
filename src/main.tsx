import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';

// Determine the base URL based on environment
const basePath = import.meta.env.DEV ? '/' : '/cook-and-bake/';

// Create router with the correct basename for GitHub Pages
const router = createBrowserRouter(
	[
		{
			path: '/*',
			element: <App />,
		},
		// ...other routes
	],
	{
		basename: basePath, // Dynamic based on environment
	}
);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
