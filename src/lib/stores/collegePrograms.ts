import { readable, type Readable } from 'svelte/store';
import { get } from 'svelte/store';

export type Program = {
	label: string;
	value: string;
};

export type College = {
	label: string;
	value: string;
	programs: Program[];
};

export const collegePrograms: Readable<College[]> = readable([
	{
		label: 'College of Architecture',
		value: 'CoA',
		programs: [
			{ label: 'Architecture', value: 'arch' },
			{ label: 'Landscape Architecture', value: 'larch' }
		]
	},
	{
		label: 'College of Arts and Letters',
		value: 'CAL',
		programs: [
			{ label: 'Araling Pilipino', value: 'ap' },
			{ label: 'Art Studies', value: 'as' },
			{ label: 'Comparative Literature', value: 'cl' },
			{ label: 'Creative Writing', value: 'cw' },
			{ label: 'English Studies', value: 'es' },
			{ label: 'European Languages', value: 'el' },
			{ label: 'Filipino', value: 'fil' },
			{ label: 'Malikhaing Pagsulat sa Filipino', value: 'mpf' },
			{ label: 'Speech Communication', value: 'sc' },
			{ label: 'Theatre Arts', value: 'ta' }
		]
	},
	{
		label: 'Asian Institute of Tourism',
		value: 'AIT',
		programs: [{ label: 'Tourism', value: 'tour' }]
	},
	{
		label: 'College of Business Administration',
		value: 'CBA',
		programs: [
			{ label: 'Business Administration', value: 'ba' },
			{ label: 'Business Administration & Accountancy', value: 'baa' }
		]
	},
	{
		label: 'School of Economics',
		value: 'SE',
		programs: [
			{ label: 'Business Economics', value: 'becon' },
			{ label: 'Economics', value: 'econ' }
		]
	},
	{
		label: 'College of Education',
		value: 'CoEd',
		programs: [
			{ label: 'Elementary Education', value: 'eled' },
			{ label: 'Secondary Education', value: 'sed' }
		]
	},
	{
		label: 'College of Engineering',
		value: 'CoE',
		programs: [
			{ label: 'Chemical Engineering', value: 'che' },
			{ label: 'Civil Engineering', value: 'ce' },
			{ label: 'Computer Engineering', value: 'cpe' },
			{ label: 'Computer Science', value: 'cs' },
			{ label: 'Electrical Engineering', value: 'ee' },
			{ label: 'Electronics & Communications Engineering', value: 'ece' },
			{ label: 'Geodetic Engineering', value: 'ge' },
			{ label: 'Industrial Engineering', value: 'ie' },
			{ label: 'Materials Engineering', value: 'mate' },
			{ label: 'Mechanical Engineering', value: 'me' },
			{ label: 'Metallurgical Engineering', value: 'met' },
			{ label: 'Mining Engineering', value: 'mine' }
		]
	},
	{
		label: 'College of Fine Arts',
		value: 'CFA',
		programs: [
			{ label: 'Art Education', value: 'ae' },
			{ label: 'Art History', value: 'ah' },
			{ label: 'Industrial Design', value: 'id' },
			{ label: 'Painting', value: 'paint' },
			{ label: 'Sculpture', value: 'sculpt' },
			{ label: 'Visual Communication', value: 'vc' }
		]
	},
	{
		label: 'College of Home Economics',
		value: 'CHE',
		programs: [
			{ label: 'Clothing Technology', value: 'ct' },
			{ label: 'Community Nutrition', value: 'cn' },
			{ label: 'Family Life & Child Development', value: 'flcd' },
			{ label: 'Food Technology', value: 'ft' },
			{ label: 'Home Economics', value: 'he' },
			{ label: 'Hotel, Restaurant & Institution Management', value: 'hrim' },
			{ label: 'Interior Design', value: 'id' }
		]
	},
	{
		label: 'College of Human Kinetics',
		value: 'CHK',
		programs: [
			{ label: 'Physical Education', value: 'pe' },
			{ label: 'Sports Science', value: 'ss' }
		]
	},
	{
		label: 'School of Library and Information Studies',
		value: 'SLIS',
		programs: [{ label: 'Library & Information Science', value: 'lis' }]
	},
	{
		label: 'College of Mass Communication',
		value: 'CMC',
		programs: [
			{ label: 'Broadcast Communication', value: 'bc' },
			{ label: 'Communication Research', value: 'cr' },
			{ label: 'Film', value: 'film' },
			{ label: 'Journalism', value: 'jour' }
		]
	},
	{
		label: 'College of Music',
		value: 'CoM',
		programs: [{ label: 'Music', value: 'music' }]
	},
	{
		label: 'National College of Public Administration and Governance',
		value: 'NCPAG',
		programs: [{ label: 'Public Administration', value: 'pa' }]
	},
	{
		label: 'College of Science',
		value: 'CoS',
		programs: [
			{ label: 'Applied Physics', value: 'ap' },
			{ label: 'Biology', value: 'bio' },
			{ label: 'Chemistry', value: 'chem' },
			{ label: 'Geology', value: 'geo' },
			{ label: 'Mathematics', value: 'math' },
			{ label: 'Molecular Biology & Biotechnology', value: 'mbb' },
			{ label: 'Physics', value: 'phys' }
		]
	},
	{
		label: 'College of Social Sciences and Philosophy',
		value: 'CSSP',
		programs: [
			{ label: 'Anthropology', value: 'anthro' },
			{ label: 'Geography', value: 'geog' },
			{ label: 'History', value: 'hist' },
			{ label: 'Linguistics', value: 'ling' },
			{ label: 'Philosophy', value: 'phil' },
			{ label: 'Political Science', value: 'polsci' },
			{ label: 'Psychology', value: 'psych' },
			{ label: 'Sociology', value: 'soc' }
		]
	},
	{
		label: 'College of Social Work and Community Development',
		value: 'CSWCD',
		programs: [
			{ label: 'Community Development', value: 'cd' },
			{ label: 'Social Work', value: 'sw' }
		]
	},
	{
		label: 'College of Statistics',
		value: 'CoStat',
		programs: [{ label: 'Statistics', value: 'stats' }]
	}
]);

function getAllPrograms(): Program[] {
	// returns a list of all the programs only
	const colleges = get(collegePrograms);
	return colleges.flatMap((college) => college.programs);
}

function getAllColleges() {
	// returns a list of all the colleges only
	const colleges = get(collegePrograms);
	return colleges.map((college) => ({
		label: college.label,
		value: college.value
	}));
}

export const allPrograms = getAllPrograms();
export const allColleges = getAllColleges();
export const collegeProgramsList = get(collegePrograms);
