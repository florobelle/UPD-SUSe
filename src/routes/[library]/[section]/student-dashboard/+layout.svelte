<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import Nav from '$lib/components/Nav.svelte';
	import { studentRoutes } from '../../../../lib/components/UIconfig/navConfig';
	import toast from 'svelte-5-french-toast';

	// Backend Imports
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import type { Session, User } from '@supabase/supabase-js';
	import { UserStore } from '$lib/stores/UserStore';
	import { readUser } from '../../../supabase/User';

	import * as Dialog from '$lib/components/ui/dialog';
	import { browser } from '$app/environment';
	// ----------------------------------------------------------------------------
	// NAVBAR
	// ----------------------------------------------------------------------------
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

	// ----------------------------------------------------------------------------
	// SESSION FUNCTIONS
	// ----------------------------------------------------------------------------
	const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	function getSessionData(user: User | undefined) {
		// gets user data and starts countdown if login is successfull
		$UserStore.authenticated = true;
		$UserStore.formData.username = user?.email ? user?.email.split('@')[0] : '';
		$UserStore = $UserStore;

		toast(`You will be logged out after 60 seconds of inactivity.`, { icon: '⏳' });
		attachActivityListeners();
		startLogOutTimer();
		getUser();
	}

	function createNewCookies(session: Session | null) {
		// creates new access and refresh tokens
		if (session) {
			createCookie('accessTokenUser', session.access_token, 1, `${library}/${section}`);
			createCookie('refreshTokenUser', session.refresh_token, 1, `${library}/${section}`);
		} else {
			toast.error(`Error with saving auth tokens. No available session.`);
		}
		return;
	}

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
		const accessTokenUser: string = readCookie('accessTokenUser');
		const refreshTokenUser: string = readCookie('refreshTokenUser');

		if (session && !accessTokenUser && !refreshTokenUser) {
			// if there is currently a session with no cookies, save tokens in cookies
			createNewCookies(session);
			getSessionData(user);
		} else if (!session && !accessTokenUser && !refreshTokenUser) {
			// if there is no session or tokens saved, go back to login
			toast.error('Please login first.');
			isLoggedOut = true;
			goto(`/${library}/${section}/auth/login`);
		} else if (accessTokenUser && refreshTokenUser) {
			// if there is no current session, start one with the saved tokens
			const {
				data: { session },
				error
			} = await supabaseClient.auth.setSession({
				access_token: accessTokenUser,
				refresh_token: refreshTokenUser
			});
			user = session?.user;

			if (error) {
				toast.error(`Error with creating session: ${error}`);
				isLoggedOut = true;
				goto(`/${library}/${section}/auth/login`);
			} else {
				createNewCookies(session);
				getSessionData(user);
			}
		}
		return;
	}

	async function endUserSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
		deleteCookie('accessTokenUser', `${library}/${section}`);
		deleteCookie('refreshTokenUser', `${library}/${section}`);

		$UserStore.authenticated = false;
		$UserStore.formData.username = '';
		$UserStore = $UserStore;

		if (error) {
			toast.error(`Error with ending session: ${error}`);
		}

		return;
	}

	// ----------------------------------------------------------------------------
	// AUTO LOG OUT DIALOG
	// ----------------------------------------------------------------------------

	let maxSessionDuration = 60 * 1000; // 10 seconds for testing
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
		const loadID: string = toast.loading('Logging you out...');
		try {
			isLoggedOut = true;
			await endUserSession();
			toast.dismiss(loadID);
			goto(`/${library}/${section}/auth/login`);
		} catch {
			toast.dismiss(loadID);
			toast.error('Logout error.');
			return;
		}
	}

	beforeNavigate(({ to, cancel }) => {
		// Confirms user will be logged out if they navigate to other pages
		if (to?.url.pathname == `/${library}/${section}/student-dashboard` || to == null) {
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

	// ----------------------------------------------------------------------------
	// READ USER INFO
	// ----------------------------------------------------------------------------

	async function getUser(): Promise<boolean> {
		// gets user information from database
		const { users, error } = await readUser({
			lib_user_id: 0,
			username: $UserStore.formData.username,
			is_approved: null,
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
			$UserStore.formData.is_approved = users[0].is_approved;
			$UserStore = $UserStore;
		}
		return true;
	}

	// ----------------------------------------------------------------------------

	$: {
		if (browser && document) {
			startUserSession();
		}
	}
</script>

<div class="h-full">
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
			{#key remainingTime}
				<Dialog.Title>You will be logged out in {remainingTime}...</Dialog.Title>
			{/key}
			<Dialog.Description>Please move your mouse to stay logged in.</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
