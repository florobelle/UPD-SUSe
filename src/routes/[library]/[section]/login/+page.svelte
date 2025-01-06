<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';

	// Backend Imports
	import { UserStore } from '$lib/stores/UserStore';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { goto } from '$app/navigation';
	import { loginRfid, sendOtp } from '../../../supabase/LoginReg';
	import { readUsername } from '../../../supabase/User';

	let loginWithRfid: boolean = true;
	let rfidGlobal: string = '';
	let usernameGlobal: string = '';

	$UserStore = {
		authenticated: false,
		toRegister: false,
		formData: {
			username: '',
			first_name: '',
			rfid: '',
			middle_name: '',
			last_name: '',
			phone_number: '',
			user_type: '',
			college: '',
			program: '',
			id: ''
		}
	};

	// ----------------------------------------------------------------------------

	async function checkRfidEnter(event: KeyboardEvent) {
		// Listens to input in the RFID field
		if (event.key == 'Enter') {
			// Check if user is already registered
			const { username, error } = await readUsername(rfidGlobal, '');

			if (error) {
				toast.error(`Error with looking for a username: ${error}`);
				return;
			}
			$UserStore.formData.rfid = rfidGlobal;
			if (username) {
				if (await loginRfid(rfidGlobal, username)) {
					$UserStore.formData.username = username;
					goto('./student-dashboard');
				}
			} else {
				goto('./register');
			}
		}
	}

	async function checkUsernameEnter(event: KeyboardEvent) {
		// Listens to input in the RFID field
		if (event.key == 'Enter') {
			// Check if user is already registered
			const { username, error } = await readUsername('', usernameGlobal);

			if (error) {
				toast.error(`Error with looking for a username: ${error}`);
			}
			$UserStore.formData.username = usernameGlobal;
			if (username) {
				if (await sendOtp(username)) {
					goto('./verify-otp');
				}
			} else {
				goto('./register');
			}
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
					bind:value={rfidGlobal}
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
				<img src="../../logos/google.png" class="h-[70%]" alt="Google logo" />
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
					bind:value={usernameGlobal}
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
