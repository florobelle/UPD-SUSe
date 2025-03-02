<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import Nav from '$lib/components/Nav.svelte';
	import { studentRoutes } from '../../../../lib/components/UIconfig/navConfig';
	import toast from 'svelte-5-french-toast';
	import Loading from '$lib/components/Loading.svelte';

	// Backend Imports
	import { navigating, page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import type { RealtimeChannel, Session, User } from '@supabase/supabase-js';
	import { UserStore } from '$lib/stores/UserStore';
	import { readUser } from '../../../supabase/User';

	import * as Dialog from '$lib/components/ui/dialog';
	import { browser } from '$app/environment';
	import { ServiceInfoStore, ServiceOptionStore, ServiceTypeStore } from '$lib/stores/ServiceStore';
	import type {
	AdminTable,
		ServiceTable,
		ServiceTypeTable,
		ServiceView,
		UsageLogTable,
		UserView
	} from '$lib/dataTypes/EntityTypes';
	import { LibraryStore, SectionStore } from '$lib/stores/LibrarySectionStore';
	import { onDestroy } from 'svelte';
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { ActiveUsageLogStore } from '$lib/stores/UsageLogStore';
	import { countDiscRoomAvailability } from '$lib/utilsBack';
	import { AdminStore } from '$lib/stores/AdminStore';
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
		if ($UserStore.authenticated) {
			return;
		}

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

		if (session) {
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
				toast.error(`Error with creating user session: ${error}`);
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
			unsubscribeRealtimeUpdates();
			goto(`/${library}/${section}/auth/login`);
		} catch {
			toast.error('Logout error.');
		}
		toast.dismiss(loadID);
		return;
	}

	beforeNavigate(({ to, cancel }) => {
		// Confirms user will be logged out if they navigate to other pages
		if (to?.url.pathname.includes(`/${library}/${section}/student-dashboard`) || to == null) {
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

	async function getUser() {
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
		return;
	}

	// ----------------------------------------------------------------------------
	// REALTIME UPDATES
	// ----------------------------------------------------------------------------

	let userChannel: RealtimeChannel;

	function updateServiceRealtime(updatedService: ServiceTable) {
		// Updates the Service Info and Option stores
		const subServiceType: ServiceTypeTable = $ServiceTypeStore.filter(
			(value) => value.service_type_id == updatedService.service_type_id
		)[0];
		let mainServiceType: string = subServiceType.main_service_type ? subServiceType.main_service_type : subServiceType.service_type;

		if (updatedService.in_use) {
			// if service is in use by other students, remove from current options of services
			$ServiceOptionStore[mainServiceType][subServiceType.service_type].options =
				$ServiceOptionStore[mainServiceType][subServiceType.service_type].options.filter(
					(value) => value.service_id != updatedService.service_id
				);
			// $ServiceInfoStore[serviceType].available_number = serviceCount;
            if (subServiceType.service_type == mainServiceType || mainServiceType == 'Umbrella') {
                $ServiceInfoStore[mainServiceType].available_number--;
                $ServiceInfoStore[mainServiceType].total_available_number--;
            } else {
                $ServiceInfoStore['Discussion Room'].available_number = countDiscRoomAvailability($ServiceOptionStore['Discussion Room'], library);
                $ServiceInfoStore[mainServiceType].total_available_number--;
            }
		} else if ($LibraryStore[updatedService.library_id] == library) {
			// if service is returned, add to current options of services
			const convertedService: ServiceView = {
				service_id: updatedService.service_id,
				service_type: subServiceType.service_type,
				service: updatedService.service,
				in_use: updatedService.in_use,
				section: $SectionStore[updatedService.section_id]
			};
            if (subServiceType.service_type == mainServiceType || mainServiceType == 'Umbrella') { // main type of service
                $ServiceOptionStore[mainServiceType][subServiceType.service_type].options.push(convertedService);
                $ServiceOptionStore[mainServiceType][subServiceType.service_type].options.sort((a, b) => a.service_id - b.service_id);
                $ServiceInfoStore[mainServiceType].available_number++;
                $ServiceInfoStore[mainServiceType].total_available_number++;

            } else { // 
                $ServiceOptionStore[mainServiceType][subServiceType.service_type].options.push(convertedService);
                $ServiceOptionStore[mainServiceType][subServiceType.service_type].options.sort((a, b) => a.service_id - b.service_id);
                $ServiceInfoStore[mainServiceType].total_available_number++;
                $ServiceInfoStore['Discussion Room'].available_number = countDiscRoomAvailability($ServiceOptionStore['Discussion Room'], library);
            }
		}
		$ServiceInfoStore = $ServiceInfoStore;
		$ServiceOptionStore = $ServiceOptionStore;
	}

	function updateUserRealtime(updatedUser: UserView) {
		// Updates User store if they are approved
		if (updatedUser.is_approved) {
			$UserStore.formData.is_approved = true;
		}
		return;
	}

	async function updateUsageLogRealtime(updatedUsageLog: UsageLogTable) {
		// Updates the Active Usage Log table based on insert or update
		const { usagelogs, error } = await readUsageLog({
			usagelog_id: updatedUsageLog.usagelog_id,
			start: null,
			end: null,
			is_active: null,
			lib_user_id: 0,
			service_type: '',
			library,
			section,
            admin_nickname: ''
		});

		if (error) {
			toast.error(`Error with getting usagelogs: ${error}`);
		} else if (usagelogs != null) {
            let serviceType:string = usagelogs[0].main_service_type ? usagelogs[0].main_service_type : usagelogs[0].service_type
			if (updatedUsageLog.is_active) {
				$ActiveUsageLogStore[serviceType] = usagelogs[0];
			} else {
				delete $ActiveUsageLogStore[serviceType];
			}
			$ActiveUsageLogStore = $ActiveUsageLogStore;
		}

		return;
	}

    async function updateAdminRealtime(updatedAdmin:AdminTable) {
        // Updates the Admin store based on update
        if (updatedAdmin.is_approved && updatedAdmin.is_active) {
            if (!$AdminStore.active_admin1) {
                $AdminStore.active_admin1 = updatedAdmin;
            } else if (!$AdminStore.active_admin2) {
                $AdminStore.active_admin2 = updatedAdmin;
            }
        }
        return;
    }

	function subscribeRealtimeUpdates() {
		// Subscribes to updates in services, usagelogs and user information
		userChannel = supabaseClient
			.channel('user-dashboard')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'service_engglib'
				},
				(payload) => {
					updateServiceRealtime(payload.new as ServiceTable);
				}
			)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'lib_user',
					filter: `lib_user_id=eq.${$UserStore.formData.lib_user_id}`
				},
				(payload) => {
					updateUserRealtime(payload.new as UserView);
				}
			)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'usagelog_engglib',
					filter: `lib_user_id=eq.${$UserStore.formData.lib_user_id}`
				},
				(payload) => {
					if (payload.eventType == 'UPDATE' || payload.eventType == 'INSERT') {
						updateUsageLogRealtime(payload.new as UsageLogTable);
					}
				}
			)
            .on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'admin_engglib'
				},
				(payload) => {
					updateAdminRealtime(payload.new as AdminTable);
				}
			)
			.subscribe();
	}

	function unsubscribeRealtimeUpdates() {
		// Unsubscribes to the tables listed above
		try {
			userChannel.unsubscribe();
		} catch {
			return;
		}
	}

	onDestroy(unsubscribeRealtimeUpdates);

	// ----------------------------------------------------------------------------

	$: {
		if (browser && document) {
			startUserSession();
		}
	}

	$: {
		if ($UserStore.authenticated && $UserStore.formData.lib_user_id) {
			subscribeRealtimeUpdates();
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
			<Loading loadingText={'Retrieving your dashboard'} loading={Boolean($navigating)} />
			<div class="relative">
				<slot></slot>
				<p
					class="absolute bottom-0 flex h-20 w-full items-end justify-center bg-gradient-to-t from-white via-white/80 to-transparent pb-2 text-center"
				>
					Made with 🧡 by Zarah Floro and Allaine Tan
				</p>
			</div>
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
