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
	import { ServiceStore } from '$lib/stores/ServiceStore';
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { UserStore } from '$lib/stores/UserStore';
	import { ActiveUsageLogStore } from '$lib/stores/UsageLogStore';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { availService, endService } from '../../../supabase/AvailEndService';
	import { page } from '$app/stores';

	let serviceSelected = '';
	let dialogOpen: Record<number, boolean> = {};

	function selectService(serviceName: string) {
		serviceSelected = serviceName;
		return;
	}

	function startService(serviceName: string, serviceIndex: number) {
		console.log(`Service started: ${serviceName}`);

		dialogOpen[serviceIndex] = false;
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
			$ActiveUsageLogStore.activeUsageLogs = usagelogs;
		}
		return;
	}

	async function availAndUpdateUsage() {
		// avails a given service and updates the active usage log store
		const loadID: string = toast.loading('Availing service...');
		const { error } = await availService(
			$ServiceStore.services[0].service_id,
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

	async function endAndUpdateUsage() {
		// ends a given usage log and service then updates the active usage log store
		const loadID: string = toast.loading('Ending service...');
		const { error } = await endService(
			$ActiveUsageLogStore.activeUsageLogs[0].usagelog_id,
			$ActiveUsageLogStore.activeUsageLogs[0].service_id,
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
</script>

<Toaster />

<div class="flex h-full w-full flex-col gap-10 p-20">
	<div class="flex w-full flex-col gap-4">
		<h1 class="text-3xl font-medium">Welcome to Engglib II, Allaine!</h1>
		<h2 class="text-lg text-[#636363]">Tap any service to begin using it!</h2>
	</div>

	<div class="grid grid-cols-4 gap-8">
		{#each services as service, index}
			<Dialog.Root bind:open={dialogOpen[index]}>
				<Dialog.Trigger class="m-0 w-full p-0">
					<ServiceCard
						selectService={() => selectService(service.service_type)}
						serviceName={service.service_type}
						serviceImgSrc={service.service_img_src}
						availableNum={service.available_number}
					/>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Avail {service.service_type}</Dialog.Title>
						<Dialog.Description>Please select the correct details!</Dialog.Description>
					</Dialog.Header>
					{#each serviceForms[service.service_type_id - 1] as serviceInput}
						{#if serviceInput.type == 'input'}
							<Label for={serviceInput.label}>{serviceInput.label}</Label>
							<Input id="name" placeholder={serviceInput.label} />
						{/if}
						{#if serviceInput.type == 'select'}
							<Label for={serviceInput.label}>{serviceInput.label}</Label>
							<Select.Root portal={null}>
								<Select.Trigger>
									<Select.Value placeholder={`Select a ${serviceInput.label}`} />
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each serviceInput.options as option}
											<Select.Item value={option.value} label={option.label}
												>{option.label}</Select.Item
											>
										{/each}
									</Select.Group>
								</Select.Content>
								<Select.Input name="favoriteFruit" />
							</Select.Root>
						{/if}
					{/each}

					<Dialog.Footer>
						<Button on:click={() => startService(service.service_type, index)}>Avail</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</div>
</div>
