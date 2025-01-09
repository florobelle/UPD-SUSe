<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount, onDestroy, tick } from 'svelte';
	import { browser } from '$app/environment';

	// Backend Imports
	import { UserStore } from '$lib/stores/UserStore';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { goto } from '$app/navigation';
	import { loginRfid, sendOtp } from '../../../supabase/LoginReg';
	import { readUsername } from '../../../supabase/User';

	let loginWithRfid: boolean = true;
	let rfidGlobal: string = '';
	let usernameGlobal: string = '';
	let rfidError: boolean = false;
	let UPMailError: boolean = false;

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
			lib_user_id: ''
		}
	};

	// ----------------------------------------------------------------------------

	async function checkRfid() {
		if (checkInputValidity('rfid')) {
			// Check if user is already registered
			const { username, error } = await readUsername(rfidGlobal, '');

			if (error) {
				toast.error(`Error with looking for a username: ${error}`);
				return;
			}
			$UserStore.formData.rfid = rfidGlobal;
			if (username) {
                const { error } = await loginRfid(rfidGlobal, username)
				if (error) {
                    toast.error(`Error with logging in with RFID: ${error}`);
                    goto('./login');
				} else {
					$UserStore.formData.username = username;
					goto('./student-dashboard');
                }
			} else {
				goto('./register');
			}
		} else {
			rfidError = true;
		}

		return;
	}

	async function checkUsername() {
		// Check if user is already registered
		if (checkInputValidity('UPmail')) {
			const { username, error } = await readUsername('', usernameGlobal);

			if (error) {
				toast.error(`Error with looking for a username: ${error}`);
			}
			$UserStore.formData.username = usernameGlobal;
			if (username) {
                const { error } = await sendOtp(username);
				if (error) {
                    toast.error(`Error with sending OTP: ${error}`);
                    goto('./login');
				} else {
					goto('./verify-otp');
                }
			} else {
				goto('./register');
			}
		} else {
			UPMailError = true;
		}

		return;
	}

	function handleKeydownRfid(event: KeyboardEvent) {
		// Listens to input in the RFID field
		if (event.key === 'Enter' || rfidGlobal.length == 10) {
			checkRfid();
		}
	}

	function handleKeydownUsername(event: KeyboardEvent) {
		// Listens to input in the UP mail field
		if (event.key === 'Enter') {
			checkUsername();
		}
	}

	function checkInputValidity(id: string) {
		const input = document.getElementById(id) as HTMLInputElement | null;
		if (input && input.validity.valid) {
			return true;
		} else if (input && !input.validity.valid) {
			return false;
		}
	}

	// ----------------------------------------------------------------------------

	// Functions for selecting and deselecting text boxes
	function selectText(id: string) {
		if (browser) {
			const input = document.getElementById(id) as HTMLElement | null;
			if (input) {
				input.focus();
			}
		}
	}

	function deselectText(id: string): void {
		if (browser) {
			const input = document.getElementById(id) as HTMLElement | null;
			if (input) {
				input.blur();
			}
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.tagName !== 'BUTTON') {
			event.preventDefault();
		}
	}

	// Lifecycle management
	onMount(() => {
		if (browser) {
			selectText('rfid');
			document.addEventListener('mousedown', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('mousedown', handleClickOutside);
		}
	});

	// Async functions to switch login modes
	async function selectLoginWithUPMail() {
		loginWithRfid = false;
		await tick();
		deselectText('rfid');
		selectText('UPmail');
	}

	async function selectLoginWithRfid() {
		loginWithRfid = true;
		await tick(); // Ensure DOM updates before interacting
		deselectText('UPmail');
		selectText('rfid');
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
				<div class="flex flex-col gap-2">
					<Input
						id="rfid"
						type="password"
						placeholder="••••••••••"
						pattern="^{'\\'}d{'{'}10{'}'}$"
						bind:value={rfidGlobal}
						on:keyup={handleKeydownRfid}
						class="max-w-full text-center text-base"
					/>
					{#if rfidError}
						<p class="text-sm font-semibold text-muted-foreground text-red-500">Tap your RFID 😡</p>
					{/if}
				</div>
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
			<Button on:click={selectLoginWithUPMail} class="flex w-full gap-2">
				<img src="../../logos/google.png" class="h-[70%]" alt="Google logo" />
				<p class="text-base">Login with UP Mail</p>
			</Button>
		</div>
	{:else}
		<div class="flex w-full flex-col gap-4">
			<!-- Login with UP Mail -->
			<div class="flex w-full flex-col gap-8">
				<div class="flex w-full flex-col gap-4 text-center">
					<h1 class="max-w-[500px] text-5xl font-medium">Enter your UP Mail</h1>
					<h2 class="text-lg font-normal">
						Avail EnggLib services using SUSê by entering your UP Mail!
					</h2>
				</div>

				<div class="flex flex-col gap-2">
					<div class="flex items-center rounded-r-md bg-zinc-100">
						<Input
							id="UPmail"
							type="text"
							placeholder="jddelacruz"
							bind:value={usernameGlobal}
							on:keyup={handleKeydownUsername}
							pattern="^[A-Za-z]+[0-9]*"
							class="max-w-full rounded-r-none text-center text-base"
						/>
						<div class="px-2">
							<p class="text-sm">@up.edu.ph</p>
						</div>
					</div>
					{#if UPMailError}
						<p class="text-sm font-semibold text-muted-foreground text-red-500">
							Please use your UP Mail!
						</p>
					{/if}
				</div>
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
			<div class="grid grid-cols-2 gap-4">
				<Button on:click={selectLoginWithRfid} variant="outline" class="w-full">
					<p class="text-base">Login with UP RFID</p>
				</Button>
				<Button on:click={checkUsername} disabled={usernameGlobal.length == 0} class="w-full">
					<p class="text-base">Send OTP</p>
				</Button>
			</div>
		</div>
	{/if}
</div>
