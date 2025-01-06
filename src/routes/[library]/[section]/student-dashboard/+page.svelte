<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';

	// Backend Imports
	import { page } from '$app/stores';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { UserStore } from '$lib/stores/UserStore';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import { onMount } from 'svelte';
	import type { Session } from '@supabase/supabase-js';
	import { beforeNavigate, goto } from '$app/navigation';
	import { linkRfid } from '../../supabase/LoginReg';

	let rfid: string = '';
	let library: string = $page.url.pathname.split('/')[1];

	let isLoggedOut: boolean = false;
	let maxSessionDuration: number = 5; // seconds
	let logOutReminder = setTimeout(remindLogOut, maxSessionDuration * 1000 - 5000); // user will be reminded of auto logout 5 seconds before
	let logOutTimer = setTimeout(logOutUser, maxSessionDuration * 1000);

	// ----------------------------------------------------------------------------
	// SESSION FUNCTIONS
	// ----------------------------------------------------------------------------

	async function startSession(session: Session | null = null) {
		// Saves the user's access and refresh tokens in cookies and creates a new session if needed.
		if (!session) {
			const sessionResponse = await supabaseClient.auth.getSession();
			session = sessionResponse.data.session;

			if (sessionResponse.error) {
				toast.error(`Error with getting session: ${sessionResponse.error}`);
			}
		}
		let user = session?.user;
		const accessToken: string = readCookie('accessToken');
		const refreshToken: string = readCookie('refreshToken');

		if (session && !accessToken && !refreshToken) {
			// if there is currently a session with no cookies, save tokens in cookies
			createCookie('accessToken', session.access_token, 1, library);
			createCookie('refreshToken', session.refresh_token, 1, library);
		} else if (!session && !accessToken && !refreshToken) {
			// if there is no session or tokens saved, go back to login
			toast.error('Please login first.');
			isLoggedOut = true;
			goto('./login');
		} else if (accessToken && refreshToken) {
			// if there is no current session, start one with the saved tokens
			const {
				data: { session },
				error
			} = await supabaseClient.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			});
			user = session?.user;

			if (error) {
				toast.error(`Error with creating session: ${error}`);
				goto('./login');
			}

			$UserStore.authenticated = true;
			$UserStore.formData.username = user?.email ? user?.email.split('@')[0] : '';
			toast.success(`You're now logged in!`);
		}

		return;
	}

	async function endSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
		deleteCookie('accessToken', library);
		deleteCookie('refreshToken', library);

		$UserStore.authenticated = false;
		$UserStore.formData.username = '';

		if (error) {
			toast.error(`Error with ending session: ${error}`);
		} else {
			toast.success('Successfull end of session.');
		}

		return;
	}

	onMount(startSession);

	// ----------------------------------------------------------------------------
	// RFID LINKING
	// ----------------------------------------------------------------------------

	async function checkRfidEnter(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			linkRfid(rfid, $UserStore.formData.username);
		}
		return;
	}

	// ----------------------------------------------------------------------------
	// LOGOUT
	// ----------------------------------------------------------------------------

	function logOutUser() {
		// Logs out the user without confirmation and goes to login page
		endSession();
		isLoggedOut = true;
		goto('./login');
	}

	beforeNavigate(({ cancel }) => {
		// Confirms user will be logged out if they navigate to other pages
		if (!isLoggedOut) {
			if (!confirm('Leaving will logout your current session. Continue?')) {
				cancel();
			} else {
				logOutUser();
			}
		}
		return;
	});

	function resetReminderTimer() {
		//  Resets the timer before a user is reminded to be logged out
		clearTimeout(logOutTimer);
		logOutTimer = setTimeout(logOutUser, maxSessionDuration * 1000);

		clearTimeout(logOutReminder);
		logOutReminder = setTimeout(remindLogOut, maxSessionDuration * 1000 - 5000);
		return;
	}

	function remindLogOut() {
		toast(`You will be logged out in ${maxSessionDuration} seconds unless you select a service.`, {
			icon: '⏳'
		});
		return;
	}
</script>

<Toaster />

<!-- Select library and section to proceed to enable the website -->
<div class="flex flex-col items-center">
	<!-- Dashboard -->
	<div class="flex w-full flex-col gap-8">
		<div class="flex w-full flex-col gap-4 text-center">
			<h1 class="text-5xl font-medium" on:mouseover={resetReminderTimer}>You are now logged in</h1>
			<h2 class="text-lg font-normal">Tap your RFID to connect it to your account!</h2>
		</div>
		<Input
			type="text"
			bind:value={rfid}
			on:keyup={checkRfidEnter}
			placeholder="••••••••••"
			class="max-w-full text-center text-base"
		/>
		<Button on:click={logOutUser} class="flex w-full gap-2">
			<p class="text-base">Logout</p>
		</Button>
	</div>
</div>
