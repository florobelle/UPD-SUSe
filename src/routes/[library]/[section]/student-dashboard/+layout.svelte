<script lang="ts">
	import toast, { Toaster } from 'svelte-5-french-toast';

	// ----------------------------------------------------------------------------
	// NAVBAR
	// ----------------------------------------------------------------------------
	import * as Resizable from '$lib/components/ui/resizable/index';
	import Nav from '$lib/components/Nav.svelte';
	import { studentRoutes } from '../../../../lib/components/UIconfig/navConfig';

	let defaultLayout = [100, 440, 655];
	let defaultCollapsed = false;
	let navCollapsedSize: number = 4;
	let isCollapsed = defaultCollapsed;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}

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
	import { linkRfid } from '../../../supabase/LoginReg';
	import { readServiceType } from '../../../supabase/ServiceType';
	import { readService } from '../../../supabase/Service';
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { readUser } from '../../../supabase/User';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { readAdmin } from '../../../supabase/Admin';

	// ----------------------------------------------------------------------------
	// SESSION FUNCTIONS
	// ----------------------------------------------------------------------------

	let rfid: string = ''; // rfid linking
	const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	async function startUserSession(session: Session | null = null) {
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
			createCookie('accessToken', session.access_token, 1, `${library}/${section}`);
			createCookie('refreshToken', session.refresh_token, 1, `${library}/${section}`);
			toast.success(`You're now logged in!`);
		} else if (!session && !accessToken && !refreshToken) {
			// if there is no session or tokens saved, go back to login
			toast.error('Please login first.');
			isLoggedOut = true;
			goto(`/${library}/${section}/auth/login`);
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
				isLoggedOut = true;
				goto(`/${library}/${section}/auth/login`);
			} else {
				toast.success(`You're now logged in!`);
			}
		}
		$UserStore.authenticated = true;
		$UserStore.formData.username = user?.email ? user?.email.split('@')[0] : '';

		getUser();
		getActiveUsageLogs();
		getServices();
		getActiveAdmins();
		attachActivityListeners();
		startLogOutTimer();
		return;
	}

	async function endUserSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
		deleteCookie('accessToken', `${library}/${section}`);
		deleteCookie('refreshToken', `${library}/${section}`);

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
	// AUTO LOG OUT DIALOG
	// ----------------------------------------------------------------------------

	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	let maxSessionDuration = 600 * 1000; // 10 seconds for testing
	let remainingTime = Math.floor(maxSessionDuration / 1000);
	let logOutTimer: NodeJS.Timeout;
	let checkInterval: NodeJS.Timeout;
	let openLogoutDialog = false;
	let startTime = Date.now();

	function startLogOutTimer() {
		// Reset variables
		startTime = Date.now();
		remainingTime = Math.floor(maxSessionDuration / 1000);
		openLogoutDialog = false;
		logOutTimer = setTimeout(logOutUser, maxSessionDuration);
		clearInterval(checkInterval);

		checkInterval = setInterval(() => {
			remainingTime = Math.max(0, Math.floor(getRemainingTime() / 1000));

			// Open dialog if there are 10 seconds left
			if (remainingTime <= 10 && !openLogoutDialog) {
				openLogoutDialog = true;
			}

			if (remainingTime <= 0) {
				clearInterval(checkInterval); // Stop checking when time runs out
			}
		}, 1000);
	}

	function resetTimer() {
		clearTimeout(logOutTimer);
		clearInterval(checkInterval);
		startLogOutTimer();
	}

	function getRemainingTime() {
		const elapsed = Date.now() - startTime;
		return maxSessionDuration - elapsed;
	}

	function attachActivityListeners() {
		const resetEvents = ['mousemove', 'keydown', 'touchstart'];
		resetEvents.forEach((event) => window.addEventListener(event, resetTimer));
	}

	// ----------------------------------------------------------------------------
	// LOGOUT
	// ----------------------------------------------------------------------------

	let isLoggedOut: boolean = false;

	async function logOutUser() {
		// Logs out the user without confirmation and goes to login page
		try {
			isLoggedOut = true;
			await endUserSession();
			goto(`/${library}/${section}/auth/login`);
		} catch {
			toast.error('Logout error.');
			return;
		}
	}

	// beforeNavigate(({ to, cancel }) => {
	// 	// Confirms user will be logged out if they navigate to other pages
	// 	if (to?.url == $page.url) {
	// 		return;
	// 	} else if (!isLoggedOut) {
	// 		if (!confirm('Leaving will logout your current session. Continue?')) {
	// 			cancel();
	// 		} else {
	// 			logOutUser();
	// 		}
	// 	}
	// 	return;
	// });

	// ----------------------------------------------------------------------------
	// READ SERVICES ANG USAGE LOGS
	// ----------------------------------------------------------------------------

	async function getServices() {
		// Reads the service types and available services in the current library and section
		// and puts the returned values in $ServiceStore
		const { serviceTypes, error } = await readServiceType();

		if (error) {
			toast.error(`Error with getting service types: ${error}`);
			return;
		} else if (serviceTypes != null) {
			$ServiceStore.serviceTypes = serviceTypes;
			const { services, error } = await readService({
				service_type: '',
				in_use: false,
				library,
				section
			});

			if (error) {
				toast.error(`Error with getting services: ${error}`);
				return;
			} else if (services != null) {
				$ServiceStore.services = services;
				console.log(services);
			}
		}
		return;
	}

	async function getActiveUsageLogs() {
		// Reads the active usage logs of the user in the current library and section
		const { usagelogs, error } = await readUsageLog({
			usagelog_id: 0,
			start: null,
			end: null,
			lib_user_id: parseInt($UserStore.formData.lib_user_id),
			service_type: '',
			library,
			section
		});

		if (error) {
			toast.error(`Error with getting usagelogs: ${error}`);
			return;
		} else if (usagelogs != null) {
			$ActiveUsageLogStore.activeUsageLogs = usagelogs;
			console.log(usagelogs);
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
		});

		if (error) {
			toast.error(`Error with reading user information: ${error}`);
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
			$UserStore.formData.is_enrolled = users[0].is_enrolled;
		}
		return true;
	}

	async function getActiveAdmins() {
		// gets two active admins from database
		const { admins, error } = await readAdmin({
			is_active: true,
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading user information: ${error}`);
			return false;
		} else if (admins != null) {
			$AdminStore.active_admin1 = admins[0];
			$AdminStore.active_admin2 = admins[1];
		}
		return true;
	}

	// ----------------------------------------------------------------------------
	toast(`You will be logged out after 60 seconds of inactivity.`, { icon: '⏳' });

	onMount(() => {
		startUserSession();
	});
</script>

<!-- <Input
	type="text"
	bind:value={rfid}
	placeholder="••••••••••"
	class="max-w-full text-center text-base"
/> -->

<div class="hidden h-full md:block">
	<Resizable.PaneGroup
		on:mouseenter={resetTimer}
		direction="horizontal"
		{onLayoutChange}
		class="items-stretch"
	>
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			collapsedSize={navCollapsedSize}
			collapsible
			minSize={15}
			maxSize={20}
			{onCollapse}
			{onExpand}
		>
			<Nav {logOutUser} {isCollapsed} routes={studentRoutes} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[2]}>
			<slot></slot>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

<Dialog.Root bind:open={openLogoutDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>You will be logged out!</Dialog.Title>
			<Dialog.Description>Please select stay to prevent being logged out</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			{#key remainingTime}
				<Button on:click={resetTimer}>Stay {remainingTime}</Button>
			{/key}
			<Button on:click={logOutUser}>Logout</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
