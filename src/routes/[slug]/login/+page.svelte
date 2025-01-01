<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';

	// Backend Imports
	import { page } from '$app/stores';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { UserStore } from '$lib/client/Stores/User';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import { onMount } from 'svelte';

	async function startSession() {
		// Saves the user's access and refresh tokens in cookies and creates a new session if needed.
		const {
			data: { session },
			error
		} = await supabaseClient.auth.getSession();
		let user = session?.user;
		const accessToken: string = readCookie('accessToken');
		const refreshToken: string = readCookie('refreshToken');

		if (session && !accessToken && !refreshToken) {
			// if there is currently a session with no cookies, save tokens in cookies
			createCookie('accessToken', session.access_token, 1, $page.url.pathname);
			createCookie('refreshToken', session.refresh_token, 1, $page.url.pathname);
		} else if (error) {
			console.log('Error with getting session: ' + error);
			return;
		} else {
			// if there is no current session, start one with the save
			const {
				data: { session },
				error
			} = await supabaseClient.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			});
			user = session?.user;

			if (error) {
				console.log('Error with creating session: ' + error);
				return;
			}
		}

		$UserStore = {
			authenticated: true,
			fullName: user?.user_metadata.full_name ? user?.user_metadata.full_name : '',
			email: user?.email ? user?.email : ''
		};

		console.log(readCookie('accessToken'));
	}

	async function endSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
		deleteCookie('accessToken', $page.url.pathname),
			deleteCookie('refreshToken', $page.url.pathname);

		$UserStore = {
			authenticated: false,
			fullName: '',
			email: ''
		};

		if (error) {
			console.log('Error with logging out: ' + error);
		} else {
			console.log('Successfull logout.');
		}
	}

	onMount(startSession);
</script>

<!-- Select library and section to proceed to enable the website -->
<div class="flex flex-col items-center">
	{#if $UserStore.fullName}
		<!-- Direct to dashboard -->
		<h1>You are now logged in, {$UserStore.fullName}</h1>
		<!-- Logout -->
		<button on:click={endSession}>Log out</button>
	{:else}
		<div class="flex w-full flex-col gap-4">
			<!-- Login Text -->
			<div class="flex w-full flex-col gap-8">
				<div class="flex w-full flex-col gap-4">
					<h1 class="text-5xl font-medium">Tap your UP ID to begin</h1>
					<h2 class="text-lg font-normal">
						Avail Engglib services using SUSê by tapping your RFID!
					</h2>
				</div>
				<Input type="text" placeholder="••••••••••" class="max-w-full text-center text-base" />
			</div>

			<!-- Divider -->
			<div class="my-4 flex w-full items-center justify-center">
				<div class="h-[0.5px] flex-grow bg-black/20"></div>
				<!-- Left line -->
				<span class="mx-4"><p>or</p></span>
				<div class="h-[0.5px] flex-grow bg-black/20"></div>
				<!-- Right line -->
			</div>

			<!-- Login -->
			<form method="POST" class="w-full">
				<Form.Button class="flex w-full gap-2">
					<img src="../logos/google.png" class="h-[70%]" alt="Google logo" />
					<p class="text-base">Login with UP Mail</p>
				</Form.Button>
			</form>
		</div>
	{/if}
</div>
