// stores/sortState.ts
import { writable } from 'svelte/store';

export interface RowChanges {
	[key: number]: {
		[key: string]: any;
	};
}

export const activeHeader = writable<string | null>(null);
export const rowChanges = writable<{ [key: number]: any }>({});
