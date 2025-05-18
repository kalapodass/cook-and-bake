import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
	const { t } = useTranslation();

	return (
		<nav>
			<ul>
				<li>
					<Link to='/'>{t('nav.home')}</Link>
				</li>
				<li>
					<Link to='/about'>{t('nav.about')}</Link>
				</li>
				<li>
					<Link to='/contact'>{t('nav.contact')}</Link>
				</li>
				{/* Remove this link from your navigation */}
				{/* <Link to="/generate-images">{t('nav.generateImages')}</Link> */}
			</ul>
		</nav>
	);
};

export default Navbar;
