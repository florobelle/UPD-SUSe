<script lang="ts">
	// UI iIports
	import { Input } from '$lib/components/ui/input';
	import PhotoCard from '$lib/components/PhotoCard.svelte';
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

<section class="grid h-screen max-h-dvh grid-cols-2">
	<!-- Photocard -->
	<div class="h-full p-4">
		<PhotoCard></PhotoCard>
	</div>

	<!-- Login -->
	<div class="h-full p-4">
		<!-- Logo header -->
		<div class="items-right flex h-[65px] w-full justify-end gap-4">
			<img src="logos/up-logo.png" class="h-full w-auto" alt="University of the Philippines logo" />
			<img
				src="logos/dcs-logo.png"
				class="h-full w-auto"
				alt="Department of Computer Science logo"
			/>
			<img src="logos/engglib-logo.png" class="h-full w-auto" alt="Engineering Library logo" />
		</div>

		<!-- Login -->
		<div class="flex h-[80%] w-full items-center">
			<!-- Select library and section to proceed to enable the website -->
			<div class="flex w-full flex-col items-center px-[150px]">
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
							<Input
								type="text"
								placeholder="••••••••••"
								class="h-[55px] max-w-full text-center text-base"
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

						<!-- Login -->
						<form method="POST" class="w-full">
							<Form.Button variant="outline" class="flex h-[55px] w-full gap-2">
								<img src="logos/google.png" class="h-[70%]" alt="Google logo" />
								<p class="text-base">Login with UP Mail</p>
							</Form.Button>
						</form>
					</div>
				{/if}
			</div>
		</div>

		<!-- Footer -->
		<div class="flex flex-col gap-4 px-[150px] text-center text-black/80">
			<p class="text-base">
				SUSe is developed by Zarah Floro and Allaine Tan for the College of Engineering Libraries.
			</p>
			<p class="text-xs">
				Initially formulated along with Gabriel Calubayan and Antonio Torres for CS191/192 under
				Prof. Rowena Solamo and continued with Victor Reyes, Michael Monasterio, and Julia Sabado
				for Engg150 under Prof. Jude Agapito.
			</p>
		</div>
	</div>
</section>
