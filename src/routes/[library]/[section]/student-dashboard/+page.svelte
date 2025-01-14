<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { services } from '$lib/components/UIconfig/serviceConfig';
	import { serviceForms } from '$lib/components/UIconfig/serviceConfig';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Alert from "$lib/components/ui/alert";
	import CircleAlert from "lucide-svelte/icons/circle-alert";

	// Backend Imports
	import { ServiceStore } from '$lib/stores/ServiceStore';
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { UserStore } from '$lib/stores/UserStore';
	import { ActiveUsageLogStore } from '$lib/stores/UsageLogStore';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { availService, endService } from '../../../supabase/AvailEndService';
	import { page } from '$app/stores';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	export let data: { libraryName: string };

	let serviceSelected = '';
	let dialogOpen: Record<number, boolean> = {};

	function selectService(serviceName: string) {
		serviceSelected = serviceName;
		return;
	}

	function startService(service: string, service_id: number) {
		console.log(`Service started: ${service} ${service_id}`);

		dialogOpen[service_id] = false;
	}

	// ----------------------------------------------------------------------------
	// READ SERVICES ANG USAGE LOGS
	// ----------------------------------------------------------------------------

	const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	async function getActiveUsageLogs() {
		// Reads the active usage logs of the user in the current library and section
		const { usagelogs, error } = await readUsageLog({
			usagelog_id: 0,
			start: null,
			end: null,
			lib_user_id: parseInt($UserStore.formData.lib_user_id),
			service_type: '',
			library,
			section
		});

		if (error) {
			toast.error(`Error with getting usagelogs: ${error}`);
			return;
		} else if (usagelogs != null) {
			console.log("usage", usagelogs)
			$ActiveUsageLogStore.activeUsageLogs = usagelogs;
		}
		return;
	}

	async function availAndUpdateUsage(service_id: number) {
		// avails a given service and updates the active usage log store

		console.log(service_id)
		const loadID: string = toast.loading('Availing service...');
		const { error } = await availService(
			service_id,
			parseInt($UserStore.formData.lib_user_id),
			$AdminStore.active_admin1 ? $AdminStore.active_admin1.admin_id : 0,
			$AdminStore.active_admin2 ? $AdminStore.active_admin2.admin_id : null
		);

		if (error) {
			toast.dismiss(loadID);
			return;
		}
		toast.dismiss(loadID);
		getActiveUsageLogs();
		toast.success('Service availed!');
	}

	async function endAndUpdateUsage(service_id: number) {
		// ends a given usage log and service then updates the active usage log store
		const loadID: string = toast.loading('Ending service...');
		const { error } = await endService(
			$ActiveUsageLogStore.activeUsageLogs[0].usagelog_id,
			service_id,
			$UserStore.formData.username,
			false
		);
		if (error) {
			toast.dismiss(loadID);
			return;
		}
		toast.dismiss(loadID);
		getActiveUsageLogs();
		toast.success('Service ended!');
	}

	// ----------------------------------------------------------------------------

	import { onMount } from 'svelte';

	let selectedOption: any;
	let tabSelected: string;
	
	onMount(() => {
		getActiveUsageLogs();
	});

	function getServiceImgSrc(serviceType: string) {
		const service = services.find(s => s.service_type === serviceType);
		return service ? service.service_img_src : '';
	}
	
</script>

<Toaster />

<ScrollArea class="h-screen">
	<div class="flex h-full w-full flex-col gap-10 p-20">
		<div class="flex w-full flex-col gap-4">
			<h1 class="text-3xl font-medium">
				Welcome to {data.libraryName}, {$UserStore.formData.first_name}!
			</h1>

			{#if $UserStore.formData.is_enrolled}
				<h2 class="text-lg text-[#636363]">Tap any service to begin using it!</h2>
			{:else}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>
						Please show your Form 5 to the library admin to have your account approved.
					</Alert.Description>
				</Alert.Root>
		  	{/if}
		</div>

		<div class="grid h-full grid-cols-4 gap-8">

			<!-- ACTIVE SERVICES -->
			{#each Object.values($ActiveUsageLogStore.activeUsageLogs) as activeUsageLog}
				<Dialog.Root>
					<Dialog.Trigger class="m-0 h-full w-full p-0">
						<ServiceCard
							selectService={() => selectService(activeUsageLog.service_type)}
							serviceName={activeUsageLog.service_type}
							serviceImgSrc={getServiceImgSrc(activeUsageLog.service_type)}
							inUse={true}
							dateStarted={activeUsageLog.start}
						/>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>End</Dialog.Title>
							<Dialog.Description>Please select the correct details!</Dialog.Description>
						</Dialog.Header>
						
						<Dialog.Footer>
							<Button on:click={()=>{endAndUpdateUsage(activeUsageLog.service_id)}}>End</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{/each}

			<!-- INACTIVE SERVICES -->
			{#each services as service}
				{#if !($ActiveUsageLogStore.activeUsageLogs.some(log => log.service_type === service.service_type))}
					<Dialog.Root bind:open={dialogOpen[service.service_type_id]}>

						<!-- Service Card -->
						<Dialog.Trigger class="m-0 h-full w-full p-0">
							<ServiceCard
								selectService={() => selectService(service.service_type)}
								serviceName={service.service_type}
								serviceImgSrc={service.service_img_src}
								availableNum={service.available_number}
							/>
						</Dialog.Trigger>

						<!-- Dialog Content of Service Card -->
						<Dialog.Content class="min-w-fit">
							<Dialog.Header>
								<Dialog.Title>Avail {service.service_type}</Dialog.Title>
								<Dialog.Description>Please select the correct details!</Dialog.Description>
							</Dialog.Header>

							<!-- Load Tabs -->
							{#if serviceForms[service.service_type_id - 1].length > 1}
								<Tabs.Root class="w-full">

									<!-- Tab headings -->
									<Tabs.List class="w-full">
										{#each serviceForms[service.service_type_id - 1] as serviceInput}
											<Tabs.Trigger on:click={() => {tabSelected = serviceInput.label; selectedOption=undefined}} value={serviceInput.label}>{serviceInput.label}</Tabs.Trigger>
										{/each}
									</Tabs.List>

									<!-- Content of tabs -->
									{#each serviceForms[service.service_type_id - 1] as serviceInput}
										{#key tabSelected}
										<Tabs.Content value={serviceInput.label}>
											<Select.Root portal={null} onSelectedChange={
												(s)=>{ 
													if (s){
														selectedOption = s as unknown as { value: number, label: string, disabled: boolean };
													}
												}
											}>
												<Select.Trigger>
													<Select.Value placeholder={`Select a ${serviceInput.label}`} />
												</Select.Trigger>
												<Select.Content>
													<Select.Group>
														{#each serviceInput.options as option}
															<Select.Item value={option.service_id} label={option.service}
																>{option.service}</Select.Item
															>
														{/each}
													</Select.Group>
												</Select.Content>
												<Select.Input name={serviceInput.label} />
											</Select.Root>
										</Tabs.Content>
										{/key}
									{/each}
								</Tabs.Root>
							{:else}
							{#each serviceForms[service.service_type_id - 1] as serviceInput}
								{#if serviceInput.type == 'select'}
									<Label for={serviceInput.label}>{serviceInput.label}</Label>
									<Select.Root portal={null} onSelectedChange={
										(s)=>{ 
											if (s){
												selectedOption = s as unknown as { value: number, label: string, disabled: boolean };
											}
										}
									}>
										<Select.Trigger>
											<Select.Value placeholder={`Select a ${serviceInput.label}`} />
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each serviceInput.options as option}
													<Select.Item value={option.service_id} label={option.service}
														>{option.service}</Select.Item
													>
												{/each}
											</Select.Group>
										</Select.Content>
										<Select.Input name={serviceInput.label} />
									</Select.Root>
								{/if}
							{/each}
							{/if}

							<Dialog.Footer>
								<Button on:click={() => availAndUpdateUsage(selectedOption.value)}>Avail</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			{/each}
		</div>
	</div>
</ScrollArea>
