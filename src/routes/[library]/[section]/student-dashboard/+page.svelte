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
						selectService={() => selectService(service.serviceName)}
						serviceName={service.serviceName}
						serviceImgSrc={service.serviceImgSrc}
					/>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Avail {service.serviceName}</Dialog.Title>
						<Dialog.Description>Please select the correct details!</Dialog.Description>
					</Dialog.Header>
					{#each serviceForms[service.serviceID] as serviceInput}
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
						<Button on:click={() => startService(service.serviceName, index)}>Avail</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</div>
</div>
