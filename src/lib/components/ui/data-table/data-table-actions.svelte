<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { rowChanges } from '$lib/stores/tableStore';
	import toast from 'svelte-5-french-toast';
	import { updateUser } from '../../../../routes/supabase/User';
	import { updateAdmin } from '../../../../routes/supabase/Admin';
	import type { AdminTable, UsageLogView } from '$lib/dataTypes/EntityTypes';
	import { UsageLogTableStore } from '$lib/stores/UsageLogStore';
	import { AdminTableStore } from '$lib/stores/AdminStore';
	import { endService } from '../../../../routes/supabase/AvailEndService';
	import { updateUsageLog } from '../../../../routes/supabase/UsageLog';

	export let id: number;
	export let row: any;

	let isEdit = false;

	function setEditRow(val: boolean) {
		isEdit = val;

		rowChanges.update((rows) => {
			if (!val) {
				// Remove the row from edit state
				const newRows = { ...rows };
				delete newRows[id];
				return newRows;
			} else {
				// Add row to edit state
				return {
					...rows,
					[id]: { ...row }
				};
			}
		});
	}

	async function saveChanges() {
		// Get the current changes for this row
		const changes = $rowChanges[id];
		if (!changes) return;

        if (changes.hasOwnProperty('lib_user_id')) {
            if (changes.hasOwnProperty('usagelog_id')) { // updated a usagelog
                const originalUsageLog: UsageLogView = $UsageLogTableStore.filter((value) => value.usagelog_id == changes.usagelog_id)[0]
                const updatedProperties: {[key: string]: string | number} = {};
                const newEndDate:Date = new Date(changes['end']);
                const originalStartDate:Date = new Date(originalUsageLog['start']);
                // only retain changes values
                for (const [key, value] of Object.entries(originalUsageLog)) {
                    if (value != changes[key]) {
                        if (key.includes('admin_nickname')) {
                            const admin:AdminTable = $AdminTableStore.filter((v) => v.nickname == changes[key])[0];
                            if (admin) {
                                updatedProperties[`admin_id${key.slice(-1)}`] = admin.admin_id;
                            } else {
                                toast.error(`No admin found with nickname: ${changes[key]}`)
                                return;
                            }
                        } else if ((key == 'end' && newEndDate > originalStartDate) || key != 'end') {
                            updatedProperties[key] = changes[key];
                        }
                    }
                }
                console.log(updatedProperties)
                // if (updatedProperties.hasOwnProperty('end')) { // end usagelog after start timestamp
                //     const { error } = await endService(
                //         originalUsageLog.usagelog_id,
                //         originalUsageLog.service_id,
                //         originalUsageLog.lib_user_id,
                //         false // hardcoded! refactor to be according to be dynamic
                //     );
                //     if (error) {
                //         toast.error(`Error with ending service: ${error}`);
                //         return;
                //     } else {
                //         toast.success('Service ended!');
                //     }
                // }
                // const { error } = await updateUsageLog(updatedProperties, originalUsageLog.usagelog_id);
                // if (error) {
                //     toast.error(`Error with updating usagelog: ${error}`);
                //     return;
                // } else {
                //     toast.success('Usagelog updated!');
                // } // test all scenarios
            } else { // updated a user record
                console.log('user!', changes)
            }
        } else if (changes.hasOwnProperty('service_id')) { // updated a service record
            console.log('service!', changes)
        } else { // updated an admin record
            console.log('admin!', changes)
        }

		// After successful save, exit edit mode
		setEditRow(false);
	}

	function cancelEdit() {
		setEditRow(false);
	}

	function deleteRow() {
		// TODO: Implement delete logic
		console.log('Deleting row:', id);
	}

    async function approveUser() {
        // approves an admin to access records
        const loadID: string = toast.loading('Approving user...');
        const { error } = await updateUser({ is_approved: true}, '', id);

        if (error) {
			toast.error(`Error with updating user with id ${id}: ${error}`);
        } else {
            toast.success("Successfully approved user!")
        }
        toast.dismiss(loadID);
        return;
    }

    async function approveAdmin() {
        // approves an admin to access records
        const loadID: string = toast.loading('Approving admin...');
        const { error } = await updateAdmin({ is_approved: true}, '', id);

        if (error) {
			toast.error(`Error with updating admin with id ${id}: ${error}`);
        } else {
            toast.success("Successfully approved admin!")
        }
        toast.dismiss(loadID);
        return;
    }
</script>

{#if isEdit}
	<div class="flex flex-row gap-2">
		<Button on:click={cancelEdit} variant="ghost" class="flex h-8 w-8 p-0">
			<X class="size-4" />
			<span class="sr-only">Cancel Edit</span>
		</Button>
		<Button on:click={saveChanges} variant="ghost" class="flex h-8 w-8 p-0">
			<Check class="size-4" />
			<span class="sr-only">Save Edit</span>
		</Button>
	</div>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<div class="flex flex-row">
				<!-- Edit, delete -->
				<Button
					variant="ghost"
					builders={[builder]}
					class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<Ellipsis class="size-4" />
					<span class="sr-only">Open Menu</span>
				</Button>

				<!-- Approve -->
				{#if 'is_approved' in row && 'admin_id' in row && !row.is_approved}
					<Button on:click={approveAdmin} variant="ghost" class="flex h-8 w-8 p-0">
						<Check class="size-4" color="green" />
						<span class="sr-only">Approve User</span>
					</Button>
                {:else if 'is_approved' in row && 'lib_user_id' in row && !row.is_approved}
                    <Button on:click={approveUser} variant="ghost" class="flex h-8 w-8 p-0">
                        <Check class="size-4" color="green" />
                        <span class="sr-only">Approve User</span>
                    </Button>
				{/if}
			</div>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Item on:click={deleteRow}>Delete</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setEditRow(true)}>Edit</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
