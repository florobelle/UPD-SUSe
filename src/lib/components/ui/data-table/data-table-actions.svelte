<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { rowChanges } from '$lib/stores/tableStore';
	import toast from 'svelte-5-french-toast';
	import { deleteUser, updateUser } from '../../../../routes/supabase/User';
	import { deleteAdmin, updateAdmin } from '../../../../routes/supabase/Admin';
	import type { AdminTable, ServiceView, UsageLogView, UserView } from '$lib/dataTypes/EntityTypes';
	import { UsageLogTableStore } from '$lib/stores/UsageLogStore';
	import { AdminTableStore } from '$lib/stores/AdminStore';
	import { endService } from '../../../../routes/supabase/AvailEndService';
	import { deleteUsageLog, updateUsageLog } from '../../../../routes/supabase/UsageLog';
	import { UserTableStore } from '$lib/stores/UserStore';
	import { ServiceTableStore } from '$lib/stores/ServiceStore';
	import { deleteService, updateService } from '../../../../routes/supabase/Service';

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

		const updatedProperties: { [key: string]: string | number } = {};
		const loadID: string = toast.loading('Approving user...');

		if (changes.hasOwnProperty('lib_user_id')) {
			if (changes.hasOwnProperty('usagelog_id')) {
				// updated a usagelog
				const originalUsageLog: UsageLogView = $UsageLogTableStore.filter(
					(value) => value.usagelog_id == changes.usagelog_id
				)[0];
				const newEndTime: number = new Date(changes['end']).getTime();
				const newStartTime: number = new Date(changes['start']).getTime();
				const originalStartTime: number = new Date(originalUsageLog['start']).getTime();
				// only retain changes values
				for (const [key, value] of Object.entries(originalUsageLog)) {
					if (value != changes[key]) {
						if (key.includes('admin_nickname')) {
							const admin: AdminTable = $AdminTableStore.filter(
								(v) => v.nickname == changes[key]
							)[0];
							if (admin) {
								updatedProperties[`admin_id${key.slice(-1)}`] = admin.admin_id;
							} else {
								toast.error(`No admin found with nickname: ${changes[key]}`);
							}
						} else if (
							(key == 'end' && newEndTime > originalStartTime) ||
							(key == 'start' && newStartTime != originalStartTime) ||
							(key != 'end' && key != 'start')
						) {
							updatedProperties[key] = changes[key];
						}
					}
				}
				if (updatedProperties.hasOwnProperty('end')) {
					// end usagelog after start timestamp
					const { error } = await endService(
						originalUsageLog.usagelog_id,
						originalUsageLog.service_id,
						originalUsageLog.lib_user_id,
						false // hardcoded! refactor to be dynamic
					);
					if (error) {
						toast.error(`Error with ending service: ${error}`);
						toast.dismiss(loadID);
						return;
					} else {
						toast.success('Service ended!');
					}
				}
				if (Object.keys(updatedProperties).length) {
					const { error } = await updateUsageLog(updatedProperties, originalUsageLog.usagelog_id);
					if (error) {
						toast.error(`Error with updating usagelog: ${error}`);
					} else {
						toast.success('Usagelog updated!');
					}
				}
			} else {
				// updated a user record
				const originalUser: UserView = $UserTableStore.filter(
					(value) => value.lib_user_id == changes.lib_user_id
				)[0];
				// only retain changes values
				for (const [key, value] of Object.entries(originalUser)) {
					if (value != changes[key]) {
						if (value != changes[key]) {
							if (key == 'user_type' || key == 'program' || key == 'college') {
								updatedProperties[`${key}_id`] = parseInt(changes[key]);
							} else {
								updatedProperties[key] = changes[key];
							}
						}
					}
				}
				if (Object.keys(updatedProperties).length) {
					const { error } = await updateUser(updatedProperties, '', originalUser.lib_user_id);
					if (error) {
						toast.error(`Error with updating user: ${error}`);
					} else {
						toast.success('User updated!');
					}
				}
			}
		} else if (changes.hasOwnProperty('service_id')) {
			// updated a service record
			const originalService: ServiceView = $ServiceTableStore.filter(
				(value) => value.service_id == changes.service_id
			)[0];
			// only retain changes values
			for (const [key, value] of Object.entries(originalService)) {
				if (value != changes[key]) {
					if (value != changes[key]) {
						updatedProperties[key] = changes[key];
					}
				}
			}
			if (Object.keys(updatedProperties).length) {
				const { error } = await updateService(updatedProperties, originalService.service_id);
				if (error) {
					toast.error(`Error with updating service: ${error}`);
				} else {
					toast.success('Service updated!');
				}
			}
		} else {
			// updated an admin record
			const originalAdmin: AdminTable = $AdminTableStore.filter(
				(value) => value.admin_id == changes.admin_id
			)[0];
			// only retain changes values
			for (const [key, value] of Object.entries(originalAdmin)) {
				if (value != changes[key]) {
					if (value != changes[key]) {
						updatedProperties[key] = changes[key];
					}
				}
			}
			if (Object.keys(updatedProperties).length) {
				const { error } = await updateAdmin(updatedProperties, '', originalAdmin.admin_id);
				if (error) {
					toast.error(`Error with updating admin: ${error}`);
				} else {
					toast.success('Admin updated!');
				}
			}
		}

		// After successful save, exit edit mode
		toast.dismiss(loadID);
		cancelEdit();
		return;
	}

	function cancelEdit() {
		setEditRow(false);
	}

	async function deleteRow() {
		// deletes a record if database allows it (cascading deletion is not allowed, any referencing records need to be deleted first)
        // 1)usagelog, 2)service, admin or user
		const loadID: string = toast.loading('Deleting user...');

        if (row.hasOwnProperty('lib_user_id')) {
            if (row.hasOwnProperty('usagelog_id')) {
                // delete usagelog
                const { error } = await deleteUsageLog(row.usagelog_id);
                if (error) {
                    toast.error(`Error with deleting admin: ${error}`);
                } else {
                    toast.success('Usagelog deleted!');
                }
            } else {
                // delete user
                const { error } = await deleteUser(row.lib_user_id);
                if (error) {
                    toast.error(`Error with deleting user: ${error}`);
                } else {
                    toast.success('User deleted!');
                }
            }
        } else if (row.hasOwnProperty('service_id')) {
            // delete service
            const { error } = await deleteService(row.service_id);
            if (error) {
                toast.error(`Error with deleting service: ${error}`);
            } else {
                toast.success('Service deleted!');
            }
        } else {
            // delete admin
            const { error } = await deleteAdmin(row.admin_id);
            if (error) {
                toast.error(`Error with deleting admin: ${error}`);
            } else {
                toast.success('Admin deleted!');
            }
        }
        toast.dismiss(loadID);
		return;
	}

	async function approveUser() {
		// approves an admin to access records
		const loadID: string = toast.loading('Approving user...');
		const { error } = await updateUser({ is_approved: true }, '', id);

		if (error) {
			toast.error(`Error with updating user with id ${id}: ${error}`);
		} else {
			toast.success('Successfully approved user!');
		}
		toast.dismiss(loadID);
		return;
	}

	async function approveAdmin() {
		// approves an admin to access records
		const loadID: string = toast.loading('Approving admin...');
		const { error } = await updateAdmin({ is_approved: true }, '', id);

		if (error) {
			toast.error(`Error with updating admin with id ${id}: ${error}`);
		} else {
			toast.success('Successfully approved admin!');
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
				<!-- <DropdownMenu.Item on:click={deleteRow}>Delete</DropdownMenu.Item> -->
				<DropdownMenu.Item on:click={() => setEditRow(true)}>Edit</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
