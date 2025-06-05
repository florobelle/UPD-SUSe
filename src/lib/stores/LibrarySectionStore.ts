import { readable, type Readable } from "svelte/store";

export const LibraryStore: Readable<{[key:number]:string}> = readable({
    1: 'engglib1',
    2: 'engglib2'
});

export const SectionStore: Readable<{[key:number]:string}> = readable({
    1: 'circulation',
    2: 'serials',
    3: 'the-learning-commons',
    4: 'ground-floor-services',
})

export const libraryTypes = [
	{ value: 'engglib1', label: 'EnggLib 1' },
	{ value: 'engglib2', label: 'EnggLib 2' },
];

export const sectionTypes = [
	{ value: '', label: 'All Sections in Library' },
	{ value: 'circulation', label: 'Circulation' },
	{ value: 'serials', label: 'Serials' },
	{ value: 'the-learning-commons', label: 'The Learning Commons' },
	{ value: 'ground-floor-services', label: 'Ground Floor Services' },
];
