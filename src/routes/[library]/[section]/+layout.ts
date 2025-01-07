import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	if (params.library === 'engglib1') {
		return {
			libraryName: 'Engineering Library I',
			libraryBuilding: ' 2/F Melchor Hall, ',
			libraryStreet: 'S. Osmeña Avenue, UP Diliman',
			librarySrc: '../../photos/MH.jpg',
			librarySection: params.section
		};
	}
	if (params.library === 'engglib2') {
		return {
			libraryName: 'Engineering Library II',
			libraryBuilding: 'G/F UP Alumni Engineers Centennial Hall,',
			libraryStreet: 'Velasquez St., UP Diliman',
			librarySrc: '../../photos/AECH.jpeg',
			librarySection: params.section
		};
	}
	error(404, 'Not found');
};
