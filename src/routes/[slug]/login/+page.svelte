<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';

	// Backend Imports
	import { UserStore } from '$lib/stores/User';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { goto } from '$app/navigation';

	let loginWithRfid: boolean = true;
	let rfid: string = '';
	let username: string = '';

	// -----

	async function loginRfid(rfid: string) {
		// Logs in using user RFID and email from the database
		const payload: { rfid: string } = { rfid };

		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		const { username, error } = await response.json();

		if (error) {
			toast.error(`Error with looking for a username: ${error}`);
		} 
        
        $UserStore.username = username;
        $UserStore.rfid = rfid;

        if (username) {
			const { data, error } = await supabaseClient.auth.signInWithPassword({
				email: `${username}@up.edu.ph`,
				password: rfid
			});
            console.log(data)

			if (error) {
				toast.error(`Error with logging in with RFID: ${error}`);
				return;
			}

            goto('./student-dashboard')
		} else {
            goto('./register')
        }

        return;
	}

	function checkRfidEnter(event: KeyboardEvent) {
		// Listens to input in the RFID field
		if (event.key == 'Enter') {
			loginRfid(rfid);
		}

		return;
	}

	async function sendOtp(username: string) {
		// Logs in using user email with OTP
		const { data, error } = await supabaseClient.auth.signInWithOtp({
			email: `${username}@up.edu.ph`
		});

		if (error) {
			toast.error(`Error with sending OTP: ${error}`);
		}
        $UserStore.username = username;
		goto('./verify-otp'); // go to the verify-otp page in the same directory
	}

	function checkUsernameEnter(event: KeyboardEvent) {
		// Listens to input in the RFID field
		if (event.key == 'Enter') {
			sendOtp(username);
		}

		return;
	}
</script>

<Toaster />

<!-- Select library and section to proceed to enable the website -->
<div class="flex flex-col items-center">
	{#if loginWithRfid}
		<div class="flex w-full flex-col gap-4">
			<!-- Login with RFID -->
			<div class="flex w-full flex-col gap-8">
				<div class="flex w-full flex-col gap-4 text-center">
					<h1 class="text-5xl font-medium">Tap your UP ID to begin</h1>
					<h2 class="text-lg font-normal">
						Avail EnggLib services using SUSê by tapping your RFID!
					</h2>
				</div>
				<Input
					type="text"
					placeholder="••••••••••"
					bind:value={rfid}
					on:keyup={checkRfidEnter}
					class="max-w-full text-center text-base"
				/>
			</div>

			<!-- Divider -->
			<div class="my-4 flex w-full items-center justify-center">
				<div class="h-[0.5px] flex-grow bg-black/20"></div>
				<!-- Left line -->
				<span class="mx-4"><p>or</p></span>
				<div class="h-[0.5px] flex-grow bg-black/20"></div>
				<!-- Right line -->
			</div>

			<!-- Login with UP Mail -->
			<Button
				on:click={() => {
					loginWithRfid = !loginWithRfid;
				}}
				class="flex w-full gap-2"
			>
				<img src="../logos/google.png" class="h-[70%]" alt="Google logo" />
				<p class="text-base">Login with UP Mail</p>
			</Button>
		</div>
	{:else}
		<div class="flex w-full flex-col gap-4">
			<!-- Login with UP Mail -->
			<div class="flex w-full flex-col gap-8">
				<div class="flex w-full flex-col gap-4 text-center">
					<h1 class="text-5xl font-medium">Enter your UP Mail to begin</h1>
					<h2 class="text-lg font-normal">
						Avail EnggLib services using SUSê by entering your UP Mail!
					</h2>
				</div>
				<Input
					type="text"
					placeholder="jddelacruz"
					bind:value={username}
					on:keyup={checkUsernameEnter}
					class="max-w-full text-center text-base"
				/>
			</div>

			<!-- Divider -->
			<div class="my-4 flex w-full items-center justify-center">
				<div class="h-[0.5px] flex-grow bg-black/20"></div>
				<!-- Left line -->
				<span class="mx-4"><p>or</p></span>
				<div class="h-[0.5px] flex-grow bg-black/20"></div>
				<!-- Right line -->
			</div>

			<!-- Login with RFID -->
			<Button
				on:click={() => {
					loginWithRfid = !loginWithRfid;
				}}
				class="w-full"
			>
				<p class="text-base">Login with UP RFID</p>
			</Button>
		</div>
	{/if}
</div>
