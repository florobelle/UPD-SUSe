<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import Button from '$lib/components/ui/button/button.svelte';

	// Backend Imports
	import { AdminStore, isPCVerified } from '$lib/stores/AdminStore';
	import { approvePC, verifyPC } from '../../../../supabase/Verifier';
	import { readCookie } from '$lib/client/Cookie';

	async function handleApproval() {
		// Approves this PC
		const { error } = await approvePC(parseInt(readCookie('pcCookie')));

		if (error) {
			toast.error(`Error with approving this PC: ${error}`);
		} else {
            const { error } = await verifyPC();
            if (error) {
                toast.error(`Error with approving this PC: ${error}`);
            } else {
                toast.success('This PC is approved!');
                $isPCVerified.isCalled = true;
                $isPCVerified.isVerified = true;
            }
		}
	}
</script>

<Toaster />

<div class="flex w-full justify-center">
	{#if $AdminStore.formData.is_approved}
		<div class="flex w-[95%] flex-col gap-4">
			<h1 class="pt-10 text-3xl font-medium">Hello, {$AdminStore.formData.nickname}</h1>
			<h2 class="text-lg text-[#636363]">Is this PC an EnggLib verified PC?</h2>
			<div>
				<Button disabled={$isPCVerified.isVerified} on:click={handleApproval}>Approve This PC</Button>
			</div>
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
