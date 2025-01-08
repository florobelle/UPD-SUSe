<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';

	// Backend Imports
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import { UserStore } from '$lib/stores/UserStore';
	import { ServiceStore } from '$lib/stores/ServiceStore';
	import { ActiveUsageLogStore } from '$lib/stores/UsageLogStore';
	import type { ServiceFilter, UsageLogFilter } from '$lib/dataTypes/EntityFilters';
	import { linkRfid } from '../../../supabase/LoginReg';
	import { readServiceType } from '../../../supabase/ServiceType';
	import { readService } from '../../../supabase/Service';
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { readUser } from '../../../supabase/User';
	import { availService, endService } from '../../../supabase/AvailEndService';

	// ----------------------------------------------------------------------------
	// SESSION FUNCTIONS
	// ----------------------------------------------------------------------------

	let rfid: string = ''; // rfid linking
	let library: string = $page.url.pathname.split('/')[1]; // session 

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
			} else {
                $UserStore.authenticated = true;
                $UserStore.formData.username = user?.email ? user?.email.split('@')[0] : '';
                toast.success(`You're now logged in!`);
            }			
		}
        getUser();
        getActiveUsageLogs();
        getServices();
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

	// ----------------------------------------------------------------------------
	// RFID LINKING
	// ----------------------------------------------------------------------------

	async function checkRfidEnter(event: KeyboardEvent) {
        // checks once RFID has been entered
		if (event.key == 'Enter') {
			const { error } = await linkRfid(rfid, $UserStore.formData.username);
            if (error) {
                toast.error(`Error with linking RFID: ${error}`);
            } else {
                toast.success('Successful RFID linking!');
            }
		}
		return;
	}

	// ----------------------------------------------------------------------------
	// LOGOUT
	// ----------------------------------------------------------------------------

	let isLoggedOut: boolean = false;
	const maxSessionDuration: number = 30 * 1000; // seconds * ticks
	let logOutTimer = setTimeout(logOutUser, maxSessionDuration);
    toast(`You will be logged out after 30 seconds of inactivity.`, {
			icon: '⏳'
		});

	async function logOutUser() {
		// Logs out the user without confirmation and goes to login page
		await endSession();
		isLoggedOut = true;
		goto('./login');
	}

	beforeNavigate(({ to, cancel }) => {
		// Confirms user will be logged out if they navigate to other pages
		if (to?.url == $page.url) {
            return;
        } else if (!isLoggedOut) {
			if (!confirm('Leaving will logout your current session. Continue?')) {
				cancel();
			} else {
				logOutUser();
			}
		}
		return;
	});

    function resetTimer() {
        // resets timer before user is automatically logged out
        clearTimeout(logOutTimer); 
        logOutTimer = setTimeout(logOutUser, maxSessionDuration)
    }

	// ----------------------------------------------------------------------------
	// READ SERVICES ANG USAGE LOGS
	// ----------------------------------------------------------------------------

    const serviceFilter: ServiceFilter = {
        service_type: '',
        in_use: false,
        library: library,
        section: '',
    }

    async function getServices() {
        // Reads the service types and available services in the current library and section
        // and puts the returned values in $ServiceStore
        const { serviceTypes, error } = await readServiceType();

        if (error) {
            toast.error(`Error with getting service types: ${error}`);
            return;
        } else if (serviceTypes != null) {
            $ServiceStore.serviceTypes = serviceTypes
            const { services, error } = await readService(serviceFilter);

            if (error) {
                toast.error(`Error with getting services: ${error}`);
                return;
            } else if (services != null) {
                $ServiceStore.services = services;
            }
        }

        return;
    }

    const activeUsageLogFilter: UsageLogFilter = {
        usagelog_id: 0,
        start: null,
        end: null,
        lib_user_id: parseInt($UserStore.formData.lib_user_id),
        service_type: '',
        library: library,
        section: '',
    }

    async function getActiveUsageLogs() {
        // Reads the active usage logs of the user in the current library and section
        const { usagelogs, error } = await readUsageLog(activeUsageLogFilter);

        if (error) {
            toast.error(`Error with getting usagelogs: ${error}`);
            return;
        } else if (usagelogs != null) {
            $ActiveUsageLogStore.activeUsageLogs = usagelogs
        }

        return;
    }

    async function getUser(): Promise<boolean> {
        // gets user information from database
        const { users, error } = await readUser({
            lib_user_id: 0,
            username: $UserStore.formData.username,
            is_enrolled: null,
            is_active: null,
            college: '',
            program: '',
            user_type: ''
        })
        
        if (error) {
            toast.error(`Error with reading user information: ${error}`)
            return false;
        } else if (users != null) {
            $UserStore.formData.lib_user_id = users[0].lib_user_id.toString();
            $UserStore.formData.college = users[0].college;
            $UserStore.formData.first_name = users[0].first_name;
            $UserStore.formData.middle_name = users[0].middle_initial ? users[0].middle_initial : '';
            $UserStore.formData.last_name = users[0].last_name;
            $UserStore.formData.user_type = users[0].user_type;
            $UserStore.formData.college = users[0].college;
            $UserStore.formData.program = users[0].program ? users[0].program : '';
        }

        return true;
    }

	// ----------------------------------------------------------------------------

    onMount(startSession);
</script>

<Toaster />

<!-- Select library and section to proceed to enable the website -->
<div class="flex flex-col items-center">
	<!-- Dashboard -->
	<div class="flex w-full flex-col gap-8">
		<div class="flex w-full flex-col gap-4 text-center">
			<h1 class="text-5xl font-medium" on:mouseenter={resetTimer}>You are now logged in</h1>
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
        <Button on:click={() => {availService(2, parseInt($UserStore.formData.lib_user_id))}} class="flex w-full gap-2">
			<p class="text-base">Avail an Umbrella #55</p>
		</Button>
        <Button on:click={() => {endService(24, 2, $UserStore.formData.username, false)}} class="flex w-full gap-2">
			<p class="text-base">End Umbrella #55 Service</p>
		</Button>
	</div>
</div>
