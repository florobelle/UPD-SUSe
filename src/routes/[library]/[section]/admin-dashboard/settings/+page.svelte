<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import Button from '$lib/components/ui/button/button.svelte';

	// Backend Imports
	import { AdminStore, PCInfoStore } from '$lib/stores/AdminStore';
	import { approvePC, verifyPC } from '../../../../supabase/Verifier';
	import { readCookie } from '$lib/client/Cookie';
	import Input from '$lib/components/ui/input/input.svelte';
	import { convertRfidInt } from '$lib/utilsBack';
	import { linkAdminRfid } from '../../../../supabase/LoginReg';

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
				$PCInfoStore.icVerifierCalled = true;
				$PCInfoStore.isVerified = true;
			}
		}
	}

	let rfidGlobal: string = ''; // rfid linking
	let rfidConverted: string = '';
	let checkCallCount: number = 0;

	async function checkRfidEnter() {
		// checks once RFID has been entered
		if (checkCallCount == 1) {
			const { error } = await linkAdminRfid(rfidConverted, $AdminStore.formData.email);
			rfidGlobal = '';
			rfidConverted = '';
			if (error) {
				toast.error(`Error with linking RFID: ${error}`);
			} else {
				toast.success('Successful RFID linking!');
			}
			checkCallCount = 0;
		}
		return;
	}

	function handleKeydownRfid(event: KeyboardEvent) {
		// Listens to input in the RFID field
		if (event.key === 'Enter' || rfidGlobal.length == 10) {
			if (rfidGlobal.match(/[a-fA-F]+/i)) {
				rfidConverted = convertRfidInt(rfidGlobal);
			} else {
				rfidConverted = rfidGlobal;
			}

			checkCallCount++;
			checkRfidEnter();
		}
	}
</script>

<Toaster />

<div class="flex flex-col w-full justify-center">
	{#if $AdminStore.formData.is_approved}
    
		<div class="flex w-full justify-center">
		<div class="flex w-[95%] flex-col gap-4">
			<h1 class="pt-10 text-3xl font-medium">Hello, {$AdminStore.formData.nickname}</h1>
			<h2 class="text-lg text-[#636363]">Is this PC an EnggLib verified PC?</h2>
			<div>
				<Button disabled={$PCInfoStore.isVerified} on:click={handleApproval}>Approve This PC</Button
				>
			</div>
		</div>
    </div>

		<div class="flex w-full justify-center">
			<div class="flex w-[95%] flex-col gap-10 md:py-20">
				<h1 class="text-3xl font-medium">Please tap your UP ID to link it to your account!</h1>

				<Input
					type="password"
					bind:value={rfidGlobal}
					on:keyup={handleKeydownRfid}
					maxlength={10}
					pattern="[0-9a-fA-F]+"
					placeholder="••••••••••"
					class="max-w-full text-center text-base"
				/>
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
