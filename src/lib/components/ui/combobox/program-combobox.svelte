<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { ChevronsUpDown, Check } from 'lucide-svelte';
	import { cn } from '$lib/utilsFront';
	import type { College } from '$lib/stores/CollegeProgramStore';
	import { collegeProgramsList } from '$lib/stores/CollegeProgramStore';
	import { allPrograms } from '$lib/stores/CollegeProgramStore';

	// Combobox variables
	let comboboxOpen = false; //determines if the user type combobox is open
	let searchProgram: string = ''; //search term for the program
	export let selectedProgram: string = '';
	export let onChange: (value: string) => void = () => {};

	// Combobox filter functions
	function filterCollegePrograms(collegeProgramsList: College[], searchTerm: string): College[] {
		// Function that filters the programs in the programs combobox based on:
		// 1. The search term in the input
		// 2. The selected college (if there is)

		const normalizedSearchTerm = searchTerm.toLowerCase();

		return collegeProgramsList
			.map((college) => {
				// only include programs that match the search term
				const filteredPrograms = college.programs.filter((program) =>
					program.label.toLowerCase().includes(normalizedSearchTerm)
				);

				if (filteredPrograms.length > 0) {
					return {
						...college,
						programs: filteredPrograms
					};
				}

				return null;
			})
			.filter(Boolean) as College[];
	}

	// Combobox filtered stores
	$: filteredPrograms = filterCollegePrograms(collegeProgramsList, searchProgram);
</script>

<Popover.Root bind:open={comboboxOpen}>
	<Popover.Trigger
		class=" border-1 flex w-[175px] justify-between rounded-sm border border-slate-200 p-2"
		role="combobox"
	>
		<p class="truncate">
			{allPrograms.find((f) => f.label === selectedProgram)?.label ?? 'Select program'}
		</p>

		<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>

	<Popover.Content>
		<Command.Root shouldFilter={false}>
			<Command.Input autofocus bind:value={searchProgram} placeholder="Search programs" />
			<Command.Empty>No program found.</Command.Empty>
			<Command.List>
				{#each filteredPrograms as college}
					<Command.Group heading={college.label}>
						{#each college.programs as program}
							<Command.Item
								value={program.label}
								onSelect={() => {
									selectedProgram = program.label;
									onChange(program.label);
									comboboxOpen = false;
								}}
							>
								{program.label}
								<Check
									class={cn(
										'ml-auto h-4 w-4',
										program.label !== selectedProgram && 'text-transparent'
									)}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
