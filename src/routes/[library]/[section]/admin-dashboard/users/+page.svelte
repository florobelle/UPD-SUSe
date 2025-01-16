<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	// Backend Imports
	import { UserTableStore } from '$lib/stores/UserStore';
	import { AdminStore, AdminTableStore } from '$lib/stores/AdminStore';
	import { page } from '$app/stores';
	import { readUser } from '../../../../supabase/User';
	import { readAdmin } from '../../../../supabase/Admin';
	import { readService } from '../../../../supabase/Service';
	import { ServiceTableStore } from '$lib/stores/ServiceStore';
	import { readUsageLog } from '../../../../supabase/UsageLog';
	import { UsageLogTableStore } from '$lib/stores/UsageLogStore';

	export let data: { libraryName: string };

	// ----------------------------------------------------------------------------
	// READ ADMIN TABLES
	// ----------------------------------------------------------------------------

	const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	async function getUserTable(): Promise<boolean> {
		// gets user information from database
		const { users, error } = await readUser({
			lib_user_id: 0,
			username: '',
			is_enrolled: null,
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

    async function getAdminTable(): Promise<boolean> {
		// gets user information from database
		const { admins, error } = await readAdmin({
			email: '',
            is_active: null,
            is_approved: null,
            library,
            section,
		});

		if (error) {
			toast.error(`Error with reading admin table: ${error}`);
			return false;
		} else if (admins != null) {
			$AdminTableStore = admins;
		}
		return true;
	}

    async function getServiceTable(): Promise<boolean> {
		// gets user information from database
		const { services, error } = await readService({
			service_type: '',
            in_use: null,
            library,
            section, 
		});

		if (error) {
			toast.error(`Error with reading service table: ${error}`);
			return false;
		} else if (services != null) {
			$ServiceTableStore = services;
		}
		return true;
	}

    async function getUsageTable(): Promise<boolean> {
		// gets user information from database
		const { usagelogs, error } = await readUsageLog({
			usagelog_id: 0,
            start: null,
            end: null,
            lib_user_id: 0,
            service_type: '',
            library,
            section,  
		});

		if (error) {
			toast.error(`Error with reading usagelog table: ${error}`);
			return false;
		} else if (usagelogs != null) {
			$UsageLogTableStore = usagelogs;
		}
		return true;
	}

	// ----------------------------------------------------------------------------

	$: {
        if ($AdminStore.authenticated) {
            getServiceTable();
        }
    }
</script>

<Toaster />

<ScrollArea class="h-screen">
	<div class="flex h-full w-full flex-col gap-10 p-20">
		<div class="flex w-full flex-col gap-4 grow">
            <h1 class="text-3xl font-medium">
                Welcome to {data.libraryName}, {$AdminStore.formData.nickname}!
            </h1>
            {#if $AdminStore.formData.is_approved}
                {#each $ServiceTableStore as user}
                    <p>{user.service}</p>
                {/each}
            {:else}
                <Alert.Root variant="destructive">
                    <CircleAlert class="h-4 w-4" />
                    <Alert.Title>Heads up!</Alert.Title>
                    <Alert.Description>
                        You are not yet an approved Administrator. Please contact Sir Jeffrey for approval.
                    </Alert.Description>
                </Alert.Root>
            {/if}
		</div>
	</div>
</ScrollArea>
