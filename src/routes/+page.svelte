<script lang="ts">
	import { page } from '$app/stores';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { UserStore } from '$lib/client/Stores/User';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import Footer from '$lib/components/navigation/Footer.svelte';
	import Hero from '$lib/components/navigation/Hero.svelte';
	import { onMount } from 'svelte';

	async function startSession() {
		// Saves the user's access and refresh tokens in cookies and creates a new session if needed.
		const {
			data: { session },
			error
		} = await supabaseClient.auth.getSession();

		if (session) {
			createCookie('accessToken', session.access_token, 1, $page.url.pathname);
			createCookie('refreshToken', session.refresh_token, 1, $page.url.pathname);
		} else if (error) {
			console.log('Error with saving session: ' + error);
		} else {
			const accessToken: string = readCookie('accessToken');
			const refreshToken: string = readCookie('refreshToken');

			const { data, error } = await supabaseClient.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			});

			if (data.user) {
				$UserStore = {
                    authenticated: true,
					fullName: data.user?.user_metadata.full_name ? data.user?.user_metadata.full_name : '',
					email: data.user?.email ? data.user?.email : ''
				};
			} else {
				console.log('Error with creating session: ' + error);
			}
        }
	}

	async function endSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
        deleteCookie('accessToken', $page.url.pathname),
        deleteCookie('refreshToken', $page.url.pathname)

        if (error) {
            console.log("Error with logging out: " + error)
        } else {
            console.log("Successfull logout.")
        }
	}

	onMount(startSession);
</script>

<div class="flex h-screen w-screen flex-col">
	<!-- Hero -->
	<Hero />

	<!-- Select library and section to proceed to enable the website -->
	<section class="flex flex-col grow items-center">
        <!-- Login -->
		<form method="POST">
			<button>Login</button>
		</form>
        <!-- Logout -->
		<button on:click={endSession}>Log out</button>
	</section>

	<!-- Footer -->
	<Footer />
</div>
