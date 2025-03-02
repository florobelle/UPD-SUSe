<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { Button } from '$lib/components/ui/button/index.js';
	import { writable, type Writable } from 'svelte/store';
	import { activeHeader } from '$lib/stores/tableStore';

	const props = $props<{
		header: string;
		onclick: () => void;
		variant?: ComponentProps<typeof Button>['variant'];
	}>();

	let up: Writable<Boolean> = writable(false);
	const { header, onclick, variant = 'ghost', ...restProps } = props;

	let isActive: Writable<boolean> = writable(false);
	activeHeader.subscribe((current) => {
		isActive.set(current === header);
		if (!isActive) {
			up.set(false);
		}
	});

	function handleClick() {
		activeHeader.set(header);
		up.update((value) => !value);
		onclick();
	}
</script>

<Button variant="ghost" on:click={handleClick} {...restProps}>
	{header}

	{#if $isActive}
		{#if $up}
			<div class="ml-2 flex flex-col -space-y-1">
				<ChevronUp class="size-3" color="#000000" />
				<ChevronDown class="size-3" />
			</div>
		{:else}
			<div class="ml-2 flex flex-col -space-y-1">
				<ChevronUp class="size-3" />
				<ChevronDown class="size-3" color="#000000" />
			</div>
		{/if}
	{:else}
		<div class="ml-2 flex flex-col -space-y-1">
			<ChevronUp class="size-3" />
			<ChevronDown class="size-3" />
		</div>
	{/if}
</Button>
