<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { allColleges } from '$lib/stores/CollegeProgramStore';
	import { ChevronsUpDown, Check } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	// ----------------------------------------------------------------------------
	// COMBOBOXES (Dropdowns for User Type, Colleges and Programs)
	// ----------------------------------------------------------------------------
	// Combobox variables
	let comboboxOpen = false; //determines if the user type combobox is open
	let searchCollege: string = ''; //search term for the college
	export let selectedCollege = '';
	export let onChange: (value: string) => void = () => {};

	// Combobox filter functions
	function filterColleges(
		allColleges: { label: string; value: string }[],
		collegeSearchTerm: string
	): { label: string; value: string }[] {
		// Function that filters the colleges in the college combobox based on:
		// 1. The search term in the input

		const normalizedSearchTerm = collegeSearchTerm.toLowerCase();

		return allColleges.filter((college) =>
			college.label.toLowerCase().includes(normalizedSearchTerm)
		);
	}

	$: filteredColleges = filterColleges(allColleges, searchCollege);
</script>

<!-- College -->
<Popover.Root bind:open={comboboxOpen}>
	<Popover.Trigger
		role="combobox"
		class=" border-1 flex w-[175px] justify-between rounded-sm border border-slate-200 p-2"
	>
		<p class="truncate">
			{allColleges.find((f) => f.label === selectedCollege)?.label ?? 'Select college'}
		</p>
		<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>

	<Popover.Content>
		<Command.Root shouldFilter={false}>
			<Command.Input autofocus bind:value={searchCollege} placeholder="Search college" />
			<Command.Empty>No program found.</Command.Empty>
			<Command.List>
				<Command.Group>
					{#each filteredColleges as college}
						<Command.Item
							value={college.label}
							onSelect={() => {
								selectedCollege = college.label;
								onChange(college.label);
								comboboxOpen = false;
							}}
						>
							{college.label}
							<Check
								class={cn(
									'ml-auto h-4 w-4',
									college.label !== selectedCollege && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
