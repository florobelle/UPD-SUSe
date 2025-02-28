<script lang="ts">
	// UI Imports
	import { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	// Backend Imports
	import { AdminStore } from '$lib/stores/AdminStore';
	import { StatisticStore } from '$lib/stores/StatisticStore';

    export let data: { libraryName: string, librarySection: string };
    let section:string = data.librarySection
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
</script>

<Toaster />

<div class="flex w-full justify-center">
	{#if $AdminStore.formData.is_approved}
		<div class="w-[95%] flex flex-col gap-4">
			<h1 class="pt-10 text-3xl font-medium">Hello, {$AdminStore.formData.nickname}</h1>
            <h2 class="text-lg text-[#636363]">Here are your statistics in {data.libraryName}, {section}</h2>
            <p>Total Usage Logs Supervised: {$StatisticStore.total_usagelogs}</p>
		</div>
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
