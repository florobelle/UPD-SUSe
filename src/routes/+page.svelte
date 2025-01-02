<script lang="ts">
	import { page } from '$app/stores';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { UserStore } from '$lib/client/Stores/User';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import Footer from '$lib/components/navigation/Footer.svelte';
	import Hero from '$lib/components/navigation/Hero.svelte';
	import type { UserFilter } from '$lib/server/EntityFilters';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';

    let rfid: string = '';

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
			toast.error(`Error with getting session: ${error}`);
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
				toast.error(`Error with creating session: ${error}`);
				return;
			}
		}
        
		$UserStore = {
			authenticated: true,
			fullName: user?.user_metadata.full_name ? user?.user_metadata.full_name : '',
			email: user?.email ? user?.email : ''
		};
        toast.success(`You're now logged in, ${$UserStore.fullName}!`)
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
			toast.error(`Error with logging out: ${error}`);
		} else {
			toast.success('Successfull logout.');
		}
	}

	onMount(startSession);

    // -----

    async function readUsers() {
        // Reads the User table using a filter.
        const payload: UserFilter = {
            id: 0,
            is_enrolled: null,
            is_active: null,
            college: '',
            unit: '',
            program: '',
            user_type: ''
        }

        const response = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
        })

        console.log((await response.json()))
    }

    async function loginRfid(rfid: string) {
        // Logs in using user RFID and email from the database
        const payload: {rfid: string} = {
            rfid
        }

        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
        })

        const { username } = await response.json()

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: `${username}@up.edu.ph`,
            password: rfid
        })

        if (error) {
            toast.error(`Error with logging in with RFID: ${error}`);
        }

        startSession();
        return;
    }
</script>

<Toaster />

<div class="flex h-screen w-screen flex-col">
	<!-- Hero -->
	<Hero />

	<!-- Select library and section to proceed to enable the website -->
	<section class="flex grow flex-col items-center">
		{#if $UserStore.fullName}
			<h1>You are now logged in, {$UserStore.fullName}</h1>
            <button on:click={readUsers}>Read User Table</button>
		{:else}
			<h1>You are not logged in.</h1>
		{/if}

        <!-- Login with Email and Password -->
        <!-- <form method="POST" action="?/rfidauth" class="flex flex-col"> -->
            <label for="rfid">RFID:</label>
            <input type="text" id="rfid" name="rfid" class="border border-4" bind:value={rfid}>
            <button on:click={() => {loginRfid(rfid)}}>Login with RFID</button>
        <!-- </form> -->

		<!-- Login with Google OAuth-->
		<form method="POST" action="?/googleauth">
			<button>Login with UP Mail</button>
		</form>
        
		<!-- Logout -->
		<button on:click={endSession}>Log out</button>
	</section>

	<!-- Footer -->
	<Footer />
</div>
