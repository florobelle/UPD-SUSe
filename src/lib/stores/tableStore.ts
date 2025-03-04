// stores/sortState.ts
import { writable } from 'svelte/store';

export interface RowChanges {
	[key: number]: {
		[key: string]: any;
	};
}

export const ActiveHeaderStore = writable<string | null>(null);
export const RowChangeStore = writable<{ [key: number]: any }>({});
