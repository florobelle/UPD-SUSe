<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	// Backend Imports
	import { AdminStore } from '$lib/stores/AdminStore';
	import { StatisticStore } from '$lib/stores/StatisticStore';
	import { countTotalService, countTotalUsageLog } from '../../../../supabase/UsageLog';
	import { page } from '$app/stores';
	import { readServiceType } from '../../../../supabase/ServiceType';
	import { ServiceTypeStore } from '$lib/stores/ServiceStore';
	import { supabaseClient } from '$lib/client/SupabaseClient';

	const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	export let data: { libraryName: string };
	const librarySection: string = section
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	async function getServiceType() {
		// gets the service types from the db as it's needed in both admin and user dashboard
		const { serviceTypes, error } = await readServiceType();

		if (error) {
			toast.error(`Error with reading service types: ${error}`);
		} else if (serviceTypes) {
			$ServiceTypeStore = serviceTypes;
		}
		return;
	}

	async function getStatistics() {
		// gets all statistics for the logged in admin
		const { count, error } = await countTotalUsageLog({
			usagelog_id: 0,
			start: null,
			end: null,
			is_active: null,
			lib_user_id: 0,
			service_type: '',
			library,
			section,
			admin_id: $AdminStore.formData.admin_id
		});

		if (error) {
			toast.error(`Error with getting usage log statistics: ${error}`);
		} else if (count) {
			$StatisticStore.total_usagelogs = count;

			for (const service of $ServiceTypeStore) {
				if (!service.main_service_type) {
					const { count, error } = await countTotalService({
						usagelog_id: 0,
						start: null,
						end: null,
						is_active: null,
						lib_user_id: 0,
						service_type: service.service_type,
						library,
						section,
						admin_id: $AdminStore.formData.admin_id
					});

					if (error) {
						toast.error(`Error with getting service statistics: ${error}`);
					} else {
						$StatisticStore.total_services[service.service_type] = count;
					}
				}
			}
		}
		return;
	}

	if ($ServiceTypeStore.length == 0) {
		getServiceType();
	}
</script>

<Toaster />

<div class="flex w-full justify-center">
	{#if $AdminStore.formData.is_approved}
		<div class="flex w-[95%] flex-col gap-4">
			<h1 class="pt-10 text-3xl font-medium">Hello, {$AdminStore.formData.nickname}</h1>
			<h2 class="text-lg text-[#636363]">
				Here are your statistics in {data.libraryName}, {librarySection}
			</h2>
			<button on:click={getStatistics}>Get Stat</button>
			{#if $StatisticStore.total_usagelogs}
				<p>Total Usage Logs Supervised: {$StatisticStore.total_usagelogs}</p>
			{/if}
			{#each Object.keys($StatisticStore.total_services) as service}
				<p>{service}: {$StatisticStore.total_services[service]}</p>
			{/each}
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
