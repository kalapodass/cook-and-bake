import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';

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
		basename: '/cook-and-bake', // This is crucial for GitHub Pages
	}
);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
