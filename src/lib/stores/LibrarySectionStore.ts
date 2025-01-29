import { readable, type Readable } from "svelte/store";

export const LibraryStore: Readable<{[key:number]:string}> = readable({
    1: 'engglib1',
    2: 'engglib2'
});

export const SectionStore: Readable<{[key:number]:string}> = readable({
    1: 'circulation',
    2: 'serials',
    3: 'tlc1',
    4: 'tlc2',
    5: 'ground-floor-service',
})