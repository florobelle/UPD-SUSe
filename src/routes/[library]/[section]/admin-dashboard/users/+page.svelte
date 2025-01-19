<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	// Backend Imports
	import { UserTableStore } from '$lib/stores/UserStore';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { page } from '$app/stores';
	import { readUser } from '../../../../supabase/User';

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

	// ----------------------------------------------------------------------------

	$: {
        if ($AdminStore.authenticated) {
            getUserTable();
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
                {#each $UserTableStore as user}
                    <p>{user.first_name}</p>
                {/each}
            {:else}
                <Alert.Root variant="destructive">
                    <CircleAlert class="h-4 w-4" />
                    <Alert.Title>Heads up!</Alert.Title>
                    <Alert.Description>
                        Please contact another library admin to have your account approved and soon view library records.
                    </Alert.Description>
                </Alert.Root>
            {/if}
		</div>
	</div>
</ScrollArea>
