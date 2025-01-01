import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	if (params.slug === 'engglib1') {
		return {
			libName: 'Engineering Library I',
			libBuilding: ' 2/F Melchor Hall, ',
			libStreet: 'S. Osmeña Avenue, UP Diliman',
			libSrc: '../photos/MH.jpg'
		};
	}
	if (params.slug === 'engglib2') {
		return {
			libName: 'Engineering Library II',
			libBuilding: 'G/F UP Alumni Engineers Centennial Hall,',
			libStreet: 'Velasquez St., UP Diliman',
			libSrc: '../photos/AECH.jpeg'
		};
	}
	error(404, 'Not found');
};
