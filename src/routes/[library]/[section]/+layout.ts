import { error } from '@sveltejs/kit';
import type { LayoutLoad } from '../$types';

export const load: LayoutLoad = ({ params }) => {
    let section:string = '';
    if (params.section === 'circulation') {
        section = 'Circulation';
    } else if (params.section === 'the-learning-commons') {
        section = 'The Learning Commons';
    }

	if (section) {
        if (params.library === 'engglib1') {
            return {
                libraryName: 'Engineering Library I',
                libraryBuilding: ' 2/F Melchor Hall, ',
                libraryStreet: 'S. Osmeña Avenue, UP Diliman',
                librarySrc: '../../../photos/MH.jpg',
                librarySection: section
            };
        } else if (params.library === 'engglib2') {
            return {
                libraryName: 'Engineering Library II',
                libraryBuilding: 'G/F UP Alumni Engineers Centennial Hall,',
                libraryStreet: 'Velasquez St., UP Diliman',
                librarySrc: '../../../photos/AECH.jpeg',
                librarySection: section
            };
        }
    }
	error(404, 'Not found');
};
