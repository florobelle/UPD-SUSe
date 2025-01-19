<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { userTypes } from '$lib/stores/UserTypeStore';
	import { ChevronsUpDown, Check } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let comboboxOpen = false;
	export let selectedUserType = '';
	export let onChange: (value: string) => void = () => {};
</script>

<Popover.Root bind:open={comboboxOpen}>
	<Popover.Trigger
		class=" border-1 flex w-[175px] justify-between rounded-sm border border-slate-200 p-2"
		role="combobox"
	>
		<p class="truncate">
			{userTypes.find((f) => f.label === selectedUserType)?.label ?? 'Select user type'}
		</p>
		<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
	</Popover.Trigger>

	<Popover.Content>
		<Command.Root shouldFilter={false}>
			<Command.Empty>No user type found.</Command.Empty>
			<Command.List>
				<Command.Group>
					{#each userTypes as userType}
						<Command.Item
							value={userType.label}
							onSelect={() => {
								selectedUserType = userType.label;
								onChange(userType.label);
								comboboxOpen = false;
							}}
						>
							{userType.label}
							<Check
								class={cn(
									'ml-auto h-4 w-4',
									userType.value !== selectedUserType && 'text-transparent'
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
