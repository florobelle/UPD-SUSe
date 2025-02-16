<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index';
	import Nav from '$lib/components/Nav.svelte';
	import { adminRoutes } from '../../../../lib/components/UIconfig/navConfig';
	import toast from 'svelte-5-french-toast';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Loading from '$lib/components/Loading.svelte';

	// Backend Imports
	import { navigating, page } from '$app/stores';
	import { beforeNavigate, goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { createCookie, deleteCookie, readCookie } from '$lib/client/Cookie';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import type { RealtimeChannel, Session, User } from '@supabase/supabase-js';

	import * as Dialog from '$lib/components/ui/dialog';
	import { readAdmin, updateAdmin } from '../../../supabase/Admin';
	import { AdminStore, AdminTableStore } from '$lib/stores/AdminStore';
	import { browser } from '$app/environment';
	import type { AdminTable, ServiceTable, ServiceView, UsageLogTable, UsageLogView, UserTable, UserView } from '$lib/dataTypes/EntityTypes';
	import { readUser } from '../../../supabase/User';
	import { UserTableStore } from '$lib/stores/UserStore';
	import { readUsageLog } from '../../../supabase/UsageLog';
	import { UsageLogTableStore } from '$lib/stores/UsageLogStore';
	import { readService } from '../../../supabase/Service';
	import { ServiceTableStore } from '$lib/stores/ServiceStore';
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

	function createNewCookies(session: Session | null) {
		// creates new access and refresh tokens
		if (session) {
			createCookie('accessTokenAdmin', session.access_token, 1, `${library}/${section}`);
			createCookie('refreshTokenAdmin', session.refresh_token, 1, `${library}/${section}`);
		} else {
			toast.error(`Error with saving auth tokens. No available session.`);
		}
		return;
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
				return;
			}
		}

		let admin = session?.user;
		const accessTokenAdmin: string = readCookie('accessTokenAdmin');
		const refreshTokenAdmin: string = readCookie('refreshTokenAdmin');

		if (session) {
			// if there is currently a session with no cookies, save tokens in cookies
			createNewCookies(session);
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

			if (error) {
				toast.error(`Error with creating admin session: ${error}`);
				isLoggedOut = true;
				goto(`/${library}/${section}/auth/login`);
			} else if (session) {
				admin = session?.user;
				createNewCookies(session);
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
            const { error } = await updateAdmin({ is_active: false }, $AdminStore.formData.email);

            if (error) {
                toast.error(`Error with deactivating admin with email ${$AdminStore.formData.email}: ${error}`);
            }
			await endAdminSession();
			goto(`/${library}/${section}/auth/login`);
		} catch {
			toast.error('Logout error.');
		}
		toast.dismiss(loadID);
		return;
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
	// GET CURRENT ADMIN DATA
	// ----------------------------------------------------------------------------

	async function getAdmin() {
		// gets user information from database
        const { error } = await updateAdmin({ is_active: true }, $AdminStore.formData.email);

		if (error) {
			toast.error(`Error with activating admin with email ${$AdminStore.formData.email}: ${error}`);
        } else {
            const { admins, error } = await readAdmin({
                admin_id: 0,
                email: $AdminStore.formData.email,
                is_active: null,
                is_approved: null,
                library: '',
                section: ''
            });

            if (error) {
                toast.error(`Error with reading admin information: ${error}`);
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
        }
		
		return;
	}

	// ----------------------------------------------------------------------------
	// REALTIME UPDATES
	// ----------------------------------------------------------------------------

	let adminChannel: RealtimeChannel;
    type EventType = 'INSERT'|'UPDATE';

	async function updateUserRealtime(updatedUser:UserTable, eventType:EventType) {
        // Updates the user record displayed in the User Table store
        console.log(updatedUser)
        const { users, error } = await readUser({
			lib_user_id: updatedUser.lib_user_id,
			username: '',
			is_approved: null,
			is_active: null,
			college: '',
			program: '',
			user_type: ''
		});

		if (error) {
			toast.error(`Error with reading user table: ${error}`);
			return false;
		} else if (users != null) {
            let newUserTableStore: Array<UserView>;
            if (eventType == 'UPDATE') {
                console.log("UPDATED!")
                newUserTableStore = $UserTableStore.filter((value) => value.lib_user_id != updatedUser.lib_user_id);
            } else {
                newUserTableStore = $UserTableStore
            }
            newUserTableStore.push(users[0]);
            $UserTableStore = newUserTableStore;
		}
    }

    async function updateUsageLogsRealtime(updatedUsagelog:UsageLogTable, eventType:EventType) {
        // Updates the usage log record in the Usage Log Table store
        const { usagelogs, error } = await readUsageLog({
			usagelog_id: updatedUsagelog.usagelog_id,
			start: null,
			end: null,
			is_active: null,
			lib_user_id: 0,
			service_type: '',
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading usagelog table: ${error}`);
			return;
		} else if (usagelogs != null) {
			let newUsageLogTableStore: Array<UsageLogView>;
            if (eventType == 'UPDATE') {
                newUsageLogTableStore = $UsageLogTableStore.filter((value) => value.usagelog_id != updatedUsagelog.usagelog_id);
            } else {
                newUsageLogTableStore = $UsageLogTableStore
            }
            newUsageLogTableStore.push(usagelogs[0]);
            $UsageLogTableStore = newUsageLogTableStore;
		}
		return;
    }

    async function updateServicesRealtime(updatedService:ServiceTable, eventType:EventType) {
        // Updates the service record in the Service Table store
        const { services, error } = await readService({
            service_id: updatedService.service_id,
			service_type: '',
			in_use: null,
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading service table: ${error}`);
			return false;
		} else if (services != null) {
			let newServiceTableStore: Array<ServiceView>;
            if (eventType == 'UPDATE') {
                newServiceTableStore = $ServiceTableStore.filter((value) => value.service_id != updatedService.service_id);
            } else {
                newServiceTableStore = $ServiceTableStore
            }
            newServiceTableStore.push(services[0]);
            $ServiceTableStore = newServiceTableStore;
		}
		return;
    }

    async function updateAdminsRealtime(updatedAdmin:AdminTable, eventType:EventType) {
        // Updates the admin record in the Admin Table store
        const { admins, error } = await readAdmin({
            admin_id: updatedAdmin.admin_id,
			email: '',
			is_active: null,
			is_approved: null,
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading admin table: ${error}`);
			return false;
		} else if (admins != null) {
			let newAdminTableStore: Array<AdminTable>;
            if (eventType == 'UPDATE') {
                newAdminTableStore = $AdminTableStore.filter((value) => value.admin_id != updatedAdmin.admin_id);
            } else {
                newAdminTableStore = $AdminTableStore
            }
            newAdminTableStore.push(admins[0]);
            $AdminTableStore = newAdminTableStore;
		}
		return;
    }

	function subscribeRealtimeUpdates() {
		// Subscribes to updates in services, usagelogs and user information
		adminChannel = supabaseClient
			.channel('user-dashboard')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'lib_user'
				},
				(payload) => {
					if (payload.eventType == "INSERT" || payload.eventType == "UPDATE") {
                        updateUserRealtime(payload.new as UserTable, payload.eventType);
                    }
				}
			)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'usagelog_engglib'
				},
				(payload) => {
					if (payload.eventType == "INSERT" || payload.eventType == "UPDATE") {
                        updateUsageLogsRealtime(payload.new as UsageLogTable, payload.eventType);
                    }
				}
			)
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'service_engglib'
				},
				(payload) => {
					if (payload.eventType == "INSERT" || payload.eventType == "UPDATE") {
                        updateServicesRealtime(payload.new as ServiceTable, payload.eventType);
                    }
				}
			)
            .on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'admin_engglib'
				},
				(payload) => {
					if (payload.eventType == "INSERT" || payload.eventType == "UPDATE") {
                        updateAdminsRealtime(payload.new as AdminTable, payload.eventType);
                    }
				}
			)
			.subscribe();
	}

    function unsubscribeRealtimeUpdates() {
        // Unsubscribes to the tables listed above
        try {
            adminChannel.unsubscribe()
        } catch {
            return;
        }
    }

    onDestroy(unsubscribeRealtimeUpdates)

	// ----------------------------------------------------------------------------
	// READ TABLES ONCE
	// ----------------------------------------------------------------------------

	async function getAdminTable() {
		// gets user information from database
		const { admins, error } = await readAdmin({
			admin_id: 0,
			email: '',
			is_active: null,
			is_approved: null,
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading admin table: ${error}`);
			return;
		} else if (admins != null) {
			$AdminTableStore = admins;
		}
		return;
	}

    async function getUserTable(): Promise<boolean> {
		// gets user information from database
		const { users, error } = await readUser({
			lib_user_id: 0,
			username: '',
			is_approved: null,
			is_active: null,
			college: '',
			program: '',
			user_type: ''
		});

		if (error) {
			toast.error(`Error with reading user table: ${error}`);
			return false;
		} else if (users != null) {
			$UserTableStore = users;
		}
		return true;
	}

    async function getUsageTable() {
		// gets user information from database
		const { usagelogs, error } = await readUsageLog({
			usagelog_id: 0,
			start: null,
			end: null,
			is_active: null,
			lib_user_id: 0,
			service_type: '',
			library,
			section
		});

		if (error) {
			toast.error(`Error with reading usagelog table: ${error}`);
			return;
		} else if (usagelogs != null) {
			$UsageLogTableStore = usagelogs;
		}
		return;
	}

	// ----------------------------------------------------------------------------

	$: {
		if (browser && document) {
			startAdminSession();
		}
	}

	$: {
		if ($AdminStore.authenticated) {
            if (!$AdminTableStore.length) {
                getAdminTable();
            }
            if (!$UserTableStore.length) {
                getUserTable();
            }
            if (!$UsageLogTableStore.length) {
                getUsageTable();
            }
			subscribeRealtimeUpdates();
		}
	}
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
				<Loading loadingText={'Retrieving your dashboard'} loading={Boolean($navigating)} />
				<div class="flex min-h-screen w-full flex-col items-center">
					<div class="w-full flex-1">
						<slot></slot>
					</div>
					<div class="p-4">
						<p>Made with 🧡 by Zarah Floro and Allaine Tan</p>
					</div>
				</div>
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
