<script lang="ts">
	import { rowChanges } from '$lib/stores/tableStore';
	import { type TableEditT } from '$lib/dataTypes/tableTypes';
	import UserTypeCombobox from '../combobox/user-type-combobox.svelte';
	import CollegeCombobox from '../combobox/college-combobox.svelte';
	import ProgramCombobox from '../combobox/program-combobox.svelte';
	import { type RowChanges } from '$lib/stores/tableStore';
	import DatetimePicker from '../datetime-picker/datetime-picker.svelte';

	export let id: number;
	export let colId: string;
	export let editT: TableEditT;
	export let initVal: any;

	// Subscribe to row changes
	$: rInEdit = !!($rowChanges as RowChanges)[id];

	// Track the current value with proper typing
	$: currentValue = ($rowChanges as RowChanges)[id]?.[colId] ?? initVal;

	function handleInput(e: Event | string | Date, isNumber = false) {
		let value: string | number;

		if (e instanceof Date) {
            value = e.toLocaleString();
		} else if (typeof e === 'string') {
			value = e;
		} else if (e.target && e.target instanceof HTMLInputElement) {
			value = isNumber ? parseFloat(e.target.value) : e.target.value;
		} else {
			value = '';
		}

		rowChanges.update((rows) => {
			const newRows = {
				...rows,
				[id]: {
					...(rows[id] || {}),
					[colId]: value
				}
			};
			return newRows;
		});
	}
</script>

{#if !rInEdit}
	{#if editT === 'datetime'}
		<p>
			{initVal
				? new Date(initVal).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
				: 'unfinished'}
		</p>
	{:else}
		<span>{initVal}</span>
	{/if}
{:else if editT === 'text'}
	<input
		type="text"
		class="w-full rounded border p-2"
		value={currentValue}
		on:input={(e) => {
			handleInput(e);
		}}
	/>
{:else if editT === 'number'}
	<input
		type="number"
		class="w-full rounded border p-1"
		value={currentValue}
		on:input={(e) => handleInput(e, true)}
	/>
{:else if editT === 'college'}
	<CollegeCombobox selectedCollege={initVal} onChange={(e) => handleInput(e, false)} />
{:else if editT === 'program'}
	<ProgramCombobox selectedProgram={initVal} onChange={(e) => handleInput(e, false)} />
{:else if editT === 'user_type'}
	<UserTypeCombobox selectedUserType={initVal} onChange={(e) => handleInput(e, false)} />
{:else if editT === 'datetime'}
	<DatetimePicker date={initVal} onChange={(date) => handleInput(date, false)} />
{:else}
	<span>{initVal}</span>
{/if}
