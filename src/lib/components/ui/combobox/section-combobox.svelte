<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { ChevronsUpDown, Check } from 'lucide-svelte';
	import { cn } from '$lib/utilsFront';
	import { sectionTypes } from '$lib/stores/LibrarySectionStore';

	let comboboxOpen = false;
	export let selectedSection = '';
	export let onChange: (value: string) => void = () => {};
</script>

<Popover.Root bind:open={comboboxOpen}>
	<Popover.Trigger
		class=" border-1 flex justify-between rounded-sm border border-slate-200 p-2"
		role="combobox"
	>
		<p class="truncate text-sm my-auto">
			{sectionTypes.find((f) => f.value === selectedSection)?.label ?? 'Select a section'}
		</p>
		<ChevronsUpDown class="my-auto ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>

	<Popover.Content>
		<Command.Root shouldFilter={false}>
			<Command.Empty>No library found.</Command.Empty>
			<Command.List>
				<Command.Group>
					{#each sectionTypes as sectionType}
						<Command.Item
							value={sectionType.label}
							onSelect={() => {
								selectedSection = sectionType.label;
								onChange(sectionType.value);
								comboboxOpen = false;
							}}
						>
							{sectionType.label}
							<Check
								class={cn(
									'ml-auto h-4 w-4',
									sectionType.value !== selectedSection && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
