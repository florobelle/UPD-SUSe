<script lang="ts">
	// UI Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import { columns } from './columns';

	// Backend Imports
	import { UserTableStore } from '$lib/stores/UserStore';
	import { AdminStore } from '$lib/stores/AdminStore';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { readUser } from '../../../../supabase/User';

	export const initialSort = [
		{ id: 'is_approved', desc: false },
		{ id: 'is_active', desc: true }
	];

	let unapprovedIsActiveUsers: boolean = true;

	async function getUserTable(getTableRecords:boolean) {
		// gets user information from database
        console.log(getTableRecords)
        const { users, error } = await readUser(
            {
                lib_user_id: 0,
                username: '',
                is_approved: null,
                is_active: null,
                college: '',
                program: '',
                user_type: ''
            },
            unapprovedIsActiveUsers
        );

        console.log(users)

        if (error) {
            toast.error(`Error with reading user table: ${error}`);
            return;
        } else if (users != null) {
            $UserTableStore = users;
        }
        return;
	}

    $: getUserTable(unapprovedIsActiveUsers)
</script>

<Toaster />

<div class="flex w-full justify-center">
	{#if $AdminStore.formData.is_approved}
		{#if $UserTableStore}
			{#key $UserTableStore}
				<div class="w-[95%]">
					<div class="flex flex-col gap-2">
						<h1 class="pt-10 text-3xl font-medium">Library Users</h1>
						<div class="flex items-center gap-2">
							<Checkbox
								id="unapprovedIsActiveUsers"
								bind:checked={unapprovedIsActiveUsers}
							/>
							<div class="grid gap-2 leading-none">
								<Label
									for="unapprovedIsActiveUsers"
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Unapproved and Active Users Only
								</Label>
							</div>
						</div>
					</div>
					<DataTable data={$UserTableStore} {columns} {initialSort} />
				</div>
			{/key}
		{:else}
			<p>Retrieving data...</p>
		{/if}
	{:else}
		<div class="flex h-full w-full flex-col gap-10 p-20">
			<div class="flex w-full grow flex-col gap-4">
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>
						Please contact another library admin to have your account approved and soon view library
						records.
					</Alert.Description>
				</Alert.Root>
			</div>
		</div>
	{/if}
</div>
