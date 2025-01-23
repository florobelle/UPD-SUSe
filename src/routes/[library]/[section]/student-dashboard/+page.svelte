<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Select from '$lib/components/ui/select/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';

	// Backend Imports
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { UserStore } from '$lib/stores/UserStore';
	import { ActiveUsageLogStore } from '$lib/stores/UsageLogStore';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { availService, endService } from '../../../supabase/AvailEndService';
	import { page } from '$app/stores';
	import { readAdmin } from '../../../supabase/Admin';
	import { readServiceType } from '../../../supabase/ServiceType';
	import {
		ServiceInfoStore,
		ServiceOptionStore,
		ServiceTypeStore,
		type ServiceInfo,
		type ServiceOption
	} from '$lib/stores/ServiceStore';
	import { readService } from '../../../supabase/Service';
	import type { UsageLogView } from '$lib/dataTypes/EntityTypes';

	export let data: { libraryName: string };

	let serviceSelected = '';
	let termsAccepted = false;

	interface DialogState {
		isOpen: boolean;
		type: 'avail' | 'end' | null;
	}

	let dialogStates: Record<number, DialogState> = {};

	function handleDialogOpen(serviceTypeId: number, type: 'avail' | 'end') {
		dialogStates[serviceTypeId] = { isOpen: true, type: type };
	}

	function handleDialogClose(serviceTypeId: number) {
		dialogStates[serviceTypeId] = { isOpen: false, type: null };
		termsAccepted = false;
	}
	function selectService(serviceName: string) {
		serviceSelected = serviceName;
		return;
	}

	// ----------------------------------------------------------------------------
	// READ SERVICES ANG USAGE LOGS
	// ----------------------------------------------------------------------------

	const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	async function getServices() {
		// Reads the service types and available services in the current library and section
		// and puts the returned values in $ServiceStore

		const { serviceTypes, error } = await readServiceType();

		if (error) {
			toast.error(`Error with reading service types: ${error}`);
		} else if (serviceTypes) {
			let serviceInfo: { [key: string]: ServiceInfo } = {};
			let serviceOption: { [key: string]: Array<ServiceOption> } = {};

			for (const serviceType of serviceTypes) {
				// service info store
				serviceInfo[serviceType.service_type] = {
					service_type: serviceType.service_type,
					service_type_id: serviceType.service_type_id,
					available_number: 0,
					service_img_src: `../../../services/${serviceType.service_type}.png`
				};

				// service option store
				if (serviceType.service_type == 'Discussion Room') {
					serviceOption[serviceType.service_type] = [
						{
							type: 'select',
							label: 'Frequency DR',
							options: [],
							variant: 'default'
						},
						{
							type: 'select',
							label: 'Programming DR',
							options: [],
							variant: 'default'
						},
						{
							type: 'select',
							label: 'Signal DR',
							options: [],
							variant: 'default'
						},
						{
							type: 'select',
							label: 'Transistor DR',
							options: [],
							variant: 'default'
						}
					];
				} else if (serviceType.service_type == 'Umbrella') {
					serviceOption[serviceType.service_type] = [
						{
							type: 'select',
							label: 'Small Orange Umbrella',
							options: [],
							variant: 'default'
						},
						{
							type: 'select',
							label: 'Small Black Umbrella',
							options: [],
							variant: 'default'
						},
						{
							type: 'select',
							label: 'Big Orange Umbrella',
							options: [],
							variant: 'default'
						}
					];
				} else {
					serviceOption[serviceType.service_type] = [
						{
							type: 'select',
							label: serviceType.service_type,
							options: [],
							variant: 'default'
						}
					];
				}
			}

			const { services, error } = await readService({
				service_type: '',
				in_use: false,
				library,
				section
			});

			if (error) {
				toast.error(`Error with getting services: ${error}`);
			} else if (services) {
				for (const service of services) {
                    // service option store
					if (service.service_type == 'Discussion Room') {
						if (service.service.includes('Frequency')) {
							serviceOption[service.service_type][0].options.push(service);
						} else if (service.service.includes('Programming')) {
							serviceOption[service.service_type][1].options.push(service);
						} else if (service.service.includes('Signal')) {
							serviceOption[service.service_type][2].options.push(service);
						} else {
							serviceOption[service.service_type][3].options.push(service);
						}
					} else if (service.service_type == 'Umbrella') {
						serviceInfo[service.service_type].available_number++;
						if (service.service.includes('Small Orange')) {
							serviceOption[service.service_type][0].options.push(service);
						} else if (service.service.includes('Small Black')) {
							serviceOption[service.service_type][1].options.push(service);
						} else {
							serviceOption[service.service_type][2].options.push(service);
						}
					} else {
						serviceInfo[service.service_type].available_number++;
						serviceOption[service.service_type][0].options.push(service);
					}
				}

				for (const subset of serviceOption['Discussion Room']) {
					if (subset.options.length == 10) {
						serviceInfo['Discussion Room'].available_number++;
					}
				}
                $ServiceTypeStore = serviceTypes;
                $ServiceInfoStore = serviceInfo;
                $ServiceOptionStore = serviceOption;
			}
		}
		return;
	}

	async function getActiveAdmins() {
		// gets two active admins from database
		const { admins, error } = await readAdmin({
			email: '',
			is_active: true,
			is_approved: true,
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading active admin information: ${error}`);
		} else if (admins) {
			$AdminStore.active_admin1 = admins[0];
			$AdminStore.active_admin2 = admins[1];
			$AdminStore = $AdminStore;
		}
		return;
	}

	async function getActiveUsageLogs() {
		// Reads the active usage logs of the user in the current library and section
		const { usagelogs, error } = await readUsageLog({
			usagelog_id: 0,
			start: null,
			end: null,
			is_active: true,
			lib_user_id: parseInt($UserStore.formData.lib_user_id),
			service_type: '',
			library,
			section
		});

		if (error) {
			toast.error(`Error with getting usagelogs: ${error}`);
		} else if (usagelogs != null) {
			let activeUsagelogs: { [key: string]: UsageLogView } = {};
			for (const usagelog of usagelogs) {
				activeUsagelogs[usagelog.service_type] = usagelog;
			}

			$ActiveUsageLogStore = activeUsagelogs;
		}
		return;
	}

	async function availAndUpdateUsage(service_id: number) {
		// avails a given service and updates the active usage log store
		if (!$AdminStore.active_admin1) {
			toast.error(`Error with availing a usage log: No active admin. Please let the admin know.`);
		} else {
            const loadID: string = toast.loading('Availing service...');
            const { error } = await availService(
                service_id,
                parseInt($UserStore.formData.lib_user_id),
                $AdminStore.active_admin1 ? $AdminStore.active_admin1.admin_id : 0,
                $AdminStore.active_admin2 ? $AdminStore.active_admin2.admin_id : null
            );

            if (error) {
                toast.error(`Error with availing a usage log: ${error}`);
            } else {
                getActiveUsageLogs();
                getServices();
                selectedOption = null;
                toast.success('Service availed!');
            }
            toast.dismiss(loadID);
        }
		return;
	}

	async function endAndUpdateUsage(service_type: string) {
		// ends a given usage log and service then updates the active usage log store
		const loadID: string = toast.loading('Ending service...');
		const { error } = await endService(
			$ActiveUsageLogStore[service_type].usagelog_id,
			$ActiveUsageLogStore[service_type].service_id,
			$UserStore.formData.username,
			Object.keys($ActiveUsageLogStore).length == 1 ? false : true
		);
		if (error) {
			toast.error(`Error with ending service: ${error}`);
		} else {
            getServices();
            getActiveUsageLogs();
            toast.success('Service ended!');
        }
        toast.dismiss(loadID);
        return;
	}

	// ----------------------------------------------------------------------------

	let selectedOption: {
		value: number;
		label: string;
		disabled: boolean;
	} | null;
	let tabSelected: string;

	// ----------------------------------------------------------------------------

	$: {
		if ($UserStore.authenticated && $UserStore.formData.lib_user_id) {
			getServices();
			getActiveUsageLogs();
			getActiveAdmins();
		}
	}
</script>

<Toaster />

<ScrollArea class="h-screen">
	<div class="flex h-full w-full flex-col gap-10 p-20">
		<div class="flex w-full grow flex-col gap-4">
			<h1 class="text-3xl font-medium">
				Welcome to {data.libraryName}, {$UserStore.formData.first_name}!
			</h1>

			{#if $UserStore.formData.is_approved}
				<h2 class="text-lg text-[#636363]">Tap any service to begin using it!</h2>
				<div class="grid h-full grid-cols-2 gap-8 xl:grid-cols-4">
					<!-- SERVICES -->
                     {#if $ServiceTypeStore.length}
                        {#each $ServiceTypeStore as serviceType}
                            <!-- ACTIVE SERVICES -->
                            {#if $ActiveUsageLogStore[serviceType.service_type]}
                                <Dialog.Root
                                    open={dialogStates[serviceType.service_type_id]?.isOpen &&
                                        dialogStates[serviceType.service_type_id]?.type === 'end'}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen) handleDialogClose(serviceType.service_type_id);
                                    }}
                                >
                                    <Dialog.Trigger
                                        class="m-0 h-full min-h-[250px] w-full p-0 xl:min-h-[0px]"
                                        on:click={() => handleDialogOpen(serviceType.service_type_id, 'end')}
                                    >
                                        <ServiceCard
                                            selectService={() => selectService(serviceType.service_type)}
                                            serviceName={serviceType.service_type}
                                            serviceImgSrc={$ServiceInfoStore[serviceType.service_type].service_img_src}
                                            inUse={true}
                                            dateStarted={$ActiveUsageLogStore[serviceType.service_type].start}
                                        />
                                    </Dialog.Trigger>
                                    <Dialog.Content>
                                        <Dialog.Header>
                                            <Dialog.Title>End</Dialog.Title>
                                            <Dialog.Description>
                                                Please confirm to end using {serviceType.service_type}.
                                            </Dialog.Description>
                                        </Dialog.Header>
                                        <Dialog.Footer>
                                            <Button
                                                on:click={() => {
                                                    endAndUpdateUsage(serviceType.service_type);
                                                    handleDialogClose(serviceType.service_type_id);
                                                }}
                                            >
                                                End
                                            </Button>
                                        </Dialog.Footer>
                                    </Dialog.Content>
                                </Dialog.Root>
    
                                <!-- INACTIVE SERVICES -->
                            {:else if $ServiceInfoStore[serviceType.service_type].available_number}
                                <Dialog.Root
                                    open={dialogStates[serviceType.service_type_id]?.isOpen &&
                                        dialogStates[serviceType.service_type_id]?.type === 'avail'}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen) handleDialogClose(serviceType.service_type_id);
                                    }}
                                >
                                    <!-- Service Card -->
                                    <Dialog.Trigger class="m-0 h-full min-h-[250px] w-full p-0 xl:min-h-[0px]">
                                        <ServiceCard
                                            selectService={() => selectService(serviceType.service_type)}
                                            serviceName={serviceType.service_type}
                                            serviceImgSrc={$ServiceInfoStore[serviceType.service_type].service_img_src}
                                            availableNum={$ServiceInfoStore[serviceType.service_type].available_number}
                                        />
                                    </Dialog.Trigger>
    
                                    <!-- Dialog Content of Service Card -->
                                    <Dialog.Content class="min-w-fit">
                                        <Dialog.Header>
                                            <Dialog.Title>Avail {serviceType.service_type}</Dialog.Title>
                                            <Dialog.Description
                                                >Please select the specific {serviceType.service_type} ID!</Dialog.Description
                                            >
                                        </Dialog.Header>
    
                                        <!-- Load Tabs -->
                                        {#if $ServiceOptionStore[serviceType.service_type].length > 1}
                                            <Tabs.Root class="w-full">
                                                <!-- Tab headings -->
                                                <Tabs.List class="w-full">
                                                    {#each $ServiceOptionStore[serviceType.service_type] as serviceInput}
                                                        <Tabs.Trigger
                                                            on:click={() => {
                                                                tabSelected = serviceInput.label;
                                                                selectedOption = null;
                                                            }}
                                                            value={serviceInput.label}>{serviceInput.label}</Tabs.Trigger
                                                        >
                                                    {/each}
                                                </Tabs.List>
    
                                                <!-- Content of tabs -->
                                                {#each $ServiceOptionStore[serviceType.service_type] as serviceInput}
                                                    {#key tabSelected}
                                                        <Tabs.Content value={serviceInput.label}>
                                                            <Select.Root
                                                                portal={null}
                                                                onSelectedChange={(s) => {
                                                                    if (s) {
                                                                        selectedOption = s as unknown as {
                                                                            value: number;
                                                                            label: string;
                                                                            disabled: boolean;
                                                                        };
                                                                    }
                                                                }}
                                                            >
                                                                <Select.Trigger>
                                                                    <Select.Value
                                                                        placeholder={`Select a ${serviceType.service_type == 'Discussion Room' ? serviceInput.label + ' seat' : serviceInput.label}`}
                                                                    />
                                                                </Select.Trigger>
                                                                <Select.Content class="max-h-[10rem] overflow-y-auto">
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
                                            {#each $ServiceOptionStore[serviceType.service_type] as serviceInput}
                                                {#if serviceInput.type == 'select'}
                                                    <Label for={serviceInput.label}>{serviceInput.label}</Label>
                                                    <Select.Root
                                                        portal={null}
                                                        onSelectedChange={(s) => {
                                                            if (s) {
                                                                selectedOption = s as unknown as {
                                                                    value: number;
                                                                    label: string;
                                                                    disabled: boolean;
                                                                };
                                                            }
                                                        }}
                                                    >
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
										<div class="flex w-full flex-col items-center justify-center gap-4 text-center">
											<div class="mx-auto flex w-full max-w-md flex-col items-center gap-2">
												<p class="text-sm text-muted-foreground">
													I accept full responsibility for the {serviceType.service_type} once it is
													loaned to me. I agree that I received the {serviceType.service_type} in good
													condition and I understand that I will be charged with corresponding fees or
													replacement if it is damaged or lost while under my possession.
												</p>
												<div class="flex items-center gap-2">
													<Checkbox id="terms" bind:checked={termsAccepted} />
													<div class="grid gap-2 leading-none">
														<Label
															for="terms"
															class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
														>
															Accept terms and conditions
														</Label>
													</div>
												</div>
											</div>

	                                            <Button
												disabled={!termsAccepted}
	                                                on:click={() =>
	                                                    availAndUpdateUsage(selectedOption ? selectedOption.value : 0)}
	                                                >Avail
											</Button>
                                            </div>
                                        </Dialog.Footer>
                                    </Dialog.Content>
                                </Dialog.Root>
                            {/if}
                        {/each}
                    {:else}
                        <p>Retrieving data...</p>
                     {/if}
				</div>
			{:else}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>
						Please show your Form 5 to the library admin to have your account approved and soon
						avail {data.libraryName} miscellaneous services.
					</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
	</div>
</ScrollArea>
