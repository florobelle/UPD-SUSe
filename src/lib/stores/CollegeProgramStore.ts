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
		value: '1',
		programs: [
			{ label: 'Architecture', value: '1' },
			{ label: 'Landscape Architecture', value: '2' }
		]
	},
	{
		label: 'College of Arts and Letters',
		value: '2',
		programs: [
			{ label: 'Araling Pilipino', value: '3' },
			{ label: 'Art Studies', value: '4' },
			{ label: 'Comparative Literature', value: '5' },
			{ label: 'Creative Writing', value: '6' },
			{ label: 'English Studies', value: '7' },
			{ label: 'European Languages', value: '8' },
			{ label: 'Filipino', value: '9' },
			{ label: 'Malikhaing Pagsulat sa Filipino', value: '10' },
			{ label: 'Speech Communication', value: '11' },
			{ label: 'Theatre Arts', value: '12' }
		]
	},
	{
		label: 'Asian Institute of Tourism',
		value: '3',
		programs: [{ label: 'Tourism', value: '13' }]
	},
	{
		label: 'College of Business Administration',
		value: '4',
		programs: [
			{ label: 'Business Administration', value: '14' },
			{ label: 'Business Administration & Accountancy', value: '15' }
		]
	},
	{
		label: 'School of Economics',
		value: '5',
		programs: [
			{ label: 'Business Economics', value: '16' },
			{ label: 'Economics', value: '17' }
		]
	},
	{
		label: 'College of Education',
		value: '6',
		programs: [
			{ label: 'Elementary Education', value: '18' },
			{ label: 'Secondary Education', value: '19' }
		]
	},
	{
		label: 'College of Engineering',
		value: '7',
		programs: [
			{ label: 'Artificial Intelligence (MEng, PhD)', value: '20' },
			{ label: 'Chemical Engineering (BS)', value: '21' },
			{ label: 'Chemical Engineering (MS, PhD)', value: '22' },
			{ label: 'Civil Engineering (BS)', value: '23' },
			{ label: 'Civil Engineering (MS, PhD)', value: '24' },
			{ label: 'Computer Engineering (BS)', value: '25' },
			{ label: 'Computer Science (BS)', value: '26' },
			{ label: 'Electrical Engineering (BS)', value: '27' },
			{ label: 'Electrical Engineering (ME, MS, PhD)', value: '28' },
			{ label: 'Environmental Engineering (Dip, MS, PhD)', value: '29' },
			{ label: 'Electronics & Communications Engineering (BS)', value: '30' },
			{ label: 'Geodetic Engineering (BS)', value: '31' },
			{ label: 'Geomatics Engineering (MS)', value: '32' },
			{ label: 'Industrial Engineering (BS)', value: '33' },
			{ label: 'Industrial Engineering (ME, MS, PhD)', value: '34' },
			{ label: 'Materials Engineering (BS)', value: '35' },
			{ label: 'Mechanical Engineering (BS)', value: '36' },
			{ label: 'Mechanical Engineering (MS, PhD)', value: '37' },
			{ label: 'Metallurgical Engineering (BS)', value: '38' },
			{ label: 'Metallurgical Engineering (MS)', value: '39' },
			{ label: 'Mining Engineering (BS)', value: '40' }
		]
	},
	{
		label: 'College of Fine Arts',
		value: '8',
		programs: [
			{ label: 'Art Education', value: '41' },
			{ label: 'Art History', value: '42' },
			{ label: 'Industrial Design', value: '43' },
			{ label: 'Painting', value: '44' },
			{ label: 'Sculpture', value: '45' },
			{ label: 'Visual Communication', value: '46' }
		]
	},
	{
		label: 'College of Home Economics',
		value: '9',
		programs: [
			{ label: 'Clothing Technology', value: '47' },
			{ label: 'Community Nutrition', value: '48' },
			{ label: 'Family Life & Child Development', value: '49' },
			{ label: 'Food Technology', value: '50' },
			{ label: 'Home Economics', value: '51' },
			{ label: 'Hotel, Restaurant & Institution Management', value: '52' },
			{ label: 'Interior Design', value: '53' }
		]
	},
	{
		label: 'College of Human Kinetics',
		value: '10',
		programs: [
			{ label: 'Physical Education', value: '54' },
			{ label: 'Sports Science', value: '55' }
		]
	},
	{
		label: 'School of Library and Information Studies',
		value: '11',
		programs: [{ label: 'Library & Information Science', value: '56' }]
	},
	{
		label: 'College of Mass Communication',
		value: '12',
		programs: [
			{ label: 'Broadcast Communication', value: '57' },
			{ label: 'Communication Research', value: '58' },
			{ label: 'Film', value: '59' },
			{ label: 'Journalism', value: '60' }
		]
	},
	{
		label: 'College of Music',
		value: '13',
		programs: [{ label: 'Music', value: '61' }]
	},
	{
		label: 'National College of Public Administration and Governance',
		value: '14',
		programs: [{ label: 'Public Administration', value: '62' }]
	},
	{
		label: 'College of Science',
		value: '15',
		programs: [
			{ label: 'Applied Physics', value: '63' },
			{ label: 'Biology', value: '64' },
			{ label: 'Chemistry', value: '65' },
			{ label: 'Geology', value: '66' },
			{ label: 'Mathematics', value: '67' },
			{ label: 'Molecular Biology & Biotechnology', value: '68' },
			{ label: 'Physics', value: '69' }
		]
	},
	{
		label: 'College of Social Sciences and Philosophy',
		value: '16',
		programs: [
			{ label: 'Anthropology', value: '70' },
			{ label: 'Geography', value: '71' },
			{ label: 'History', value: '72' },
			{ label: 'Linguistics', value: '73' },
			{ label: 'Philosophy', value: '74' },
			{ label: 'Political Science', value: '75' },
			{ label: 'Psychology', value: '76' },
			{ label: 'Sociology', value: '77' }
		]
	},
	{
		label: 'College of Social Work and Community Development',
		value: '17',
		programs: [
			{ label: 'Community Development', value: '78' },
			{ label: 'Social Work', value: '79' }
		]
	},
	{
		label: 'College of Statistics',
		value: '18',
		programs: [{ label: 'Statistics', value: '80' }]
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
