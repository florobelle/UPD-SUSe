<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	// Backend Imports
	import { AdminStore } from '$lib/stores/AdminStore';
	import { StatisticStore } from '$lib/stores/StatisticStore';
	import { countTotalService } from '../../../../supabase/UsageLog';
	import { readServiceType } from '../../../../supabase/ServiceType';
	import { ServiceTypeStore } from '$lib/stores/ServiceStore';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import DatePicker from '$lib/components/ui/date-picker/date-picker.svelte';
	import LibraryCombobox from '$lib/components/ui/combobox/library-combobox.svelte';
	import SectionCombobox from '$lib/components/ui/combobox/section-combobox.svelte';
    import { Chart, Svg, Axis, Bars, Labels } from 'layerchart'
    import { scaleBand } from 'd3-scale';

	let selectedLibrary: string = 'engglib1';
	let selectedSection: string = '';
	let selectedAdmin: string = '';
	let selectedStart: Date | null = null;
	let selectedEnd: Date | null = null;

	// export let data: { libraryName: string };
	// const librarySection: string = section
	// 	.split('-')
	// 	.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
	// 	.join(' ');

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
		$StatisticStore.total_usagelogs = 0;
        $StatisticStore.total_services = [];
		for (const service of $ServiceTypeStore) {
			if (!service.main_service_type) {
				const { count, error } = await countTotalService({
					usagelog_id: 0,
					start: selectedStart,
					end: selectedEnd,
					is_active: null,
					lib_user_id: 0,
					service_type: service.service_type,
					library: selectedLibrary,
					section: selectedSection,
					admin_nickname: selectedAdmin
				});

				if (error) {
					toast.error(`Error with getting service statistics: ${error}`);
				} else if (count) {
                    const stat: {[key:string]: number | string} = {service: service.service_type, value: count};
					$StatisticStore.total_services.push(stat);
					$StatisticStore.total_usagelogs += count;
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
			<h2 class="text-lg text-[#636363]">Here is your report</h2>
			<div class="grid grid-cols-6 gap-1">
				<LibraryCombobox bind:selectedLibrary onChange={(e: string) => (selectedLibrary = e)} />
				<SectionCombobox bind:selectedSection onChange={(e: string) => (selectedSection = e)} />
				<Input placeholder="Enter admin nickname" class="max-w-sm" bind:value={selectedAdmin} />
				<DatePicker bind:selectedDate={selectedStart} placeholder={'Enter start date'} />
				<DatePicker bind:selectedDate={selectedEnd} placeholder={'Enter end date'} />
				<Button on:click={getStatistics}>Get Statistics</Button>
			</div>

            <!-- Per Admin Statistic -->
            <div class="h-[300px] rounded border p-4">
                <Chart
                    data={$StatisticStore.total_services}
                    x="service"
                    xScale={scaleBand().padding(0.4)}
                    y="value"
                    yDomain={[0, null]}
                    yNice={4}
                    padding={{ left: 16, bottom: 24 }}
                >
                    <Svg>
                        <Axis placement="left" grid rule />
                        <Axis
                            placement="bottom" rule
                        />
                        <Bars radius={4} rounded="top" strokeWidth={1} class="fill-primary " />
                        <Labels placement="inside" format="integer" class="fill-secondary"/>
                    </Svg>
                </Chart>
            </div>
			{#if $StatisticStore.total_usagelogs}
				<p>Total Usage Logs Supervised: {$StatisticStore.total_usagelogs}</p>
			{/if}

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
