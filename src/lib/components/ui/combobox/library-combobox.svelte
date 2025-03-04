<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { ChevronsUpDown, Check } from 'lucide-svelte';
	import { cn } from '$lib/utilsFront';
	import { libraryTypes } from '$lib/stores/LibrarySectionStore';

	let comboboxOpen = false;
	export let selectedLibrary = '';
	export let onChange: (value: string) => void = () => {};
</script>

<Popover.Root bind:open={comboboxOpen}>
	<Popover.Trigger
		class=" border-1 flex justify-between rounded-sm border border-slate-200 p-2"
		role="combobox"
	>
		<p class="truncate text-sm my-auto">
			{libraryTypes.find((f) => f.value === selectedLibrary)?.label ?? 'Select a library'}
		</p>
		<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>

	<Popover.Content>
		<Command.Root shouldFilter={false}>
			<Command.Empty>No library found.</Command.Empty>
			<Command.List>
				<Command.Group>
					{#each libraryTypes as libraryType}
						<Command.Item
							value={libraryType.label}
							onSelect={() => {
								selectedLibrary = libraryType.label;
								onChange(libraryType.value);
								comboboxOpen = false;
							}}
						>
							{libraryType.label}
							<Check
								class={cn(
									'ml-auto h-4 w-4',
									libraryType.value !== selectedLibrary && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
