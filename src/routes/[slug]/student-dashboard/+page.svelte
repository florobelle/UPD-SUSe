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
	import type { ServiceFilter, UsageLogFilter } from '$lib/dataTypes/EntityFilters';
	import { linkRfid } from '../../supabase/LoginReg';
	import { readService } from '../../supabase/Service';
	import { readServiceType } from '../../supabase/ServiceType';
	import { readUsageLog } from '../../supabase/UsageLog';
	import { ActiveUsageLogStore } from '$lib/stores/UsageLogStore';
	import { readUser } from '../../supabase/User';

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
                $UserStore.formData.userName = user?.email ? user?.email.split('@')[0] : '';
                toast.success(`You're now logged in!`);
            }			
		}

        const { users, error } = await readUser({
            lib_user_id: 0,
            username: $UserStore.formData.userName,
            is_enrolled: null,
            is_active: null,
            college: '',
            program: '',
            user_type: ''
        })
        
        if (error) {
            toast.error(`Error with reading user information: ${error}`)
            return;
        } else if (users != null) {
            $UserStore.formData.IDNum = users[0].lib_user_id.toString();
            $UserStore.formData.college = users[0].college;
            $UserStore.formData.firstName = users[0].first_name;
            $UserStore.formData.middleName = users[0].middle_initial ? users[0].middle_initial : '';
            $UserStore.formData.lastName = users[0].last_name;
            $UserStore.formData.userType = users[0].user_type;
            $UserStore.formData.college = users[0].college;
            $UserStore.formData.program = users[0].program ? users[0].program : '';
        }

		return;
	}

	async function endSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
		deleteCookie('accessToken', library);
		deleteCookie('refreshToken', library);

		$UserStore.authenticated = false;
		$UserStore.formData.userName = '';

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
			linkRfid(rfid, $UserStore.formData.userName);
		}
        return;
	}

	// ----------------------------------------------------------------------------
	// LOGOUT
	// ----------------------------------------------------------------------------

	let isLoggedOut: boolean = false;
	const maxSessionDuration: number = 30 * 1000; // seconds * ticks
    const reminderTime: number = maxSessionDuration - 5000 // reminds 5 seconds before automatic logout
	let logOutReminder = setTimeout(remindLogOut, reminderTime); // user will be reminded of auto logout 5 seconds before
	let logOutTimer = setTimeout(logOutUser, maxSessionDuration);

	function logOutUser() {
		// Logs out the user without confirmation and goes to login page
		endSession();
		isLoggedOut = true;
        clearTimeout(logOutReminder);
        clearTimeout(logOutTimer);
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
		// Resets the timer before a user is reminded to be logged out
		clearTimeout(logOutReminder);
		logOutReminder = setTimeout(remindLogOut, reminderTime);

		clearTimeout(logOutTimer);
		logOutTimer = setTimeout(logOutUser, maxSessionDuration);
		return;
	}

	function remindLogOut() {
        // Reminds user of automatic logout
		toast(`You will be logged out in 5 seconds unless you select a service.`, {
			icon: '⏳'
		});
		return;
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
        lib_user_id: parseInt($UserStore.formData.IDNum),
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

	// ----------------------------------------------------------------------------

    onMount(() => {
        startSession();
        getServices();
        getActiveUsageLogs();
    });
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
