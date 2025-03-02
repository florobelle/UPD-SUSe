<script lang="ts">
	// UI Imports
	import { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import { columns } from './columns';

	// Backend Imports
	import { AdminStore } from '$lib/stores/AdminStore';
	import { ServiceTableStore } from '$lib/stores/ServiceStore';

	export const initialSort = [
		{ id: 'in_use', desc: true },
		{ id: 'service_id', desc: false }
	];	
</script>

<Toaster />

<!-- <ScrollArea class="h-screen"> -->
<div class="flex w-full justify-center">
	{#if $AdminStore.formData.is_approved}
		{#if $ServiceTableStore}
			{#key $ServiceTableStore}
				<div class="w-[95%]">
					<h1 class="pt-10 text-3xl font-medium">Services</h1>
					<DataTable data={$ServiceTableStore} {columns} {initialSort} />
				</div>
			{/key}
		{:else}
			<p>Retrieving data...</p>
		{/if}
	{:else}
		<div class="flex h-full w-full flex-col gap-10 p-20">
			<div class="flex w-full grow flex-col gap-4">
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>
						Please contact another library admin to have your account approved and soon view library
						records.
					</Alert.Description>
				</Alert.Root>
			</div>
		</div>
	{/if}
</div>
<!-- </ScrollArea> -->
