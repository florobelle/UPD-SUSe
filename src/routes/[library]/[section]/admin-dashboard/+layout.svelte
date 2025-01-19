<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import Nav from '$lib/components/Nav.svelte';
	import { adminRoutes } from '../../../../lib/components/UIconfig/navConfig';
	import toast from 'svelte-5-french-toast';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	// Backend Imports
	import { page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import type { Session, User } from '@supabase/supabase-js';

	import * as Dialog from '$lib/components/ui/dialog';
	import { readAdmin } from '../../../supabase/Admin';
	import { AdminStore } from '$lib/stores/AdminStore';
	// ----------------------------------------------------------------------------
	// NAVBAR
	// ----------------------------------------------------------------------------
	let defaultLayout = [20, 80];
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

	function getSessionData(admin: User | undefined) {
		// gets user data and starts countdown if login is successfull
		$AdminStore.authenticated = true;
		$AdminStore.formData.email = admin?.email ? admin.email : '';
		$AdminStore = $AdminStore;

		toast(`You will be logged out after 15 minutes of inactivity.`, { icon: '⏳' });
		attachActivityListeners();
		startLogOutTimer();
		getAdmin();
	}

	async function startAdminSession(session: Session | null = null) {
		// Saves the user's access and refresh tokens in cookies and creates a new session if needed.
		if ($AdminStore.authenticated) {
			return;
		}

		if (!session) {
			const sessionResponse = await supabaseClient.auth.getSession();
			session = sessionResponse.data.session;

			if (sessionResponse.error) {
				toast.error(`Error with getting session: ${sessionResponse.error}`);
			}
		}

		let admin = session?.user;
		const accessTokenAdmin: string = readCookie('accessTokenAdmin');
		const refreshTokenAdmin: string = readCookie('refreshTokenAdmin');

		if (session && !accessTokenAdmin && !refreshTokenAdmin) {
			// if there is currently a session with no cookies, save tokens in cookies
			createCookie('accessTokenAdmin', session.access_token, 1, `${library}/${section}`);
			createCookie('refreshTokenAdmin', session.refresh_token, 1, `${library}/${section}`);
			getSessionData(admin);
		} else if (!session && !accessTokenAdmin && !refreshTokenAdmin) {
			// if there is no session or tokens saved, go back to login
			toast.error('Please login first.');
			isLoggedOut = true;
			goto(`/${library}/${section}/auth/login`);
		} else if (accessTokenAdmin && refreshTokenAdmin) {
			// if there is no current session, start one with the saved tokens
			const {
				data: { session },
				error
			} = await supabaseClient.auth.setSession({
				access_token: accessTokenAdmin,
				refresh_token: refreshTokenAdmin
			});
			admin = session?.user;

			if (error) {
				toast.error(`Error with creating session: ${error}`);
				isLoggedOut = true;
				goto(`/${library}/${section}/auth/login`);
			} else {
				getSessionData(admin);
			}
		}
		return;
	}

	async function endAdminSession() {
		// Ends the user's current session if available.
		const { error } = await supabaseClient.auth.signOut();
		deleteCookie('accessTokenAdmin', `${library}/${section}`);
		deleteCookie('refreshTokenAdmin', `${library}/${section}`);

		$AdminStore.authenticated = false;
		$AdminStore.formData.email = '';
		$AdminStore = $AdminStore;

		if (error) {
			toast.error(`Error with ending session: ${error}`);
		}
		return;
	}

	// ----------------------------------------------------------------------------
	// AUTO LOG OUT DIALOG
	// ----------------------------------------------------------------------------

	let maxSessionDuration = 900 * 1000; // 10 seconds for testing
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
		logOutTimer = setTimeout(logOutAdmin, maxSessionDuration);
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

	async function logOutAdmin() {
		// Logs out the user without confirmation and goes to login page
		const loadID: string = toast.loading('Logging you out...');
		try {
			isLoggedOut = true;
			$AdminStore.toLogin = false;
			await endAdminSession();
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
		if (to?.url.pathname.includes(`/${library}/${section}/admin-dashboard`) || to == null) {
			return;
		} else if (!isLoggedOut) {
			if (!confirm('Leaving will logout your current session. Continue?')) {
				cancel();
			} else {
				logOutAdmin();
			}
		}
		return;
	});

	// ----------------------------------------------------------------------------
	// GET ADMIN DATA
	// ----------------------------------------------------------------------------

	async function getAdmin(): Promise<boolean> {
		// gets user information from database
		const { admins, error } = await readAdmin({
			email: $AdminStore.formData.email,
			is_active: null,
			is_approved: null,
			library: '',
			section: ''
		});

		if (error) {
			toast.error(`Error with reading admin information: ${error}`);
			return false;
		} else if (admins != null) {
			$AdminStore.formData.admin_id = admins[0].admin_id;
			$AdminStore.formData.rfid = admins[0].rfid;
			$AdminStore.formData.nickname = admins[0].nickname;
			$AdminStore.formData.email = admins[0].email;
			$AdminStore.formData.is_approved = admins[0].is_approved;
			$AdminStore.formData.library = library; // NOTE: the admin's designation
			$AdminStore.formData.section = section;

			$AdminStore = $AdminStore;
		}
		return true;
	}

	// ----------------------------------------------------------------------------
	onMount(() => {
		startAdminSession();
	});
</script>

<div class="h-full">
	<Resizable.PaneGroup
		on:mouseenter={resetTimer}
		direction="horizontal"
		{onLayoutChange}
		class="w-full items-stretch"
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
			<Nav logOutUser={logOutAdmin} {isCollapsed} routes={adminRoutes} />
		</Resizable.Pane>
		<Resizable.Handle withHandle class="h-screen" />
		<Resizable.Pane defaultSize={defaultLayout[2]}>
			<ScrollArea orientation="both" class="h-screen">
				<slot></slot>
			</ScrollArea>
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
