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
	import { UserTableStore } from '$lib/stores/UserStore';

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

	function saveChanges() {
		// Get the current changes for this row
		const changes = $rowChanges[id];
		if (!changes) return;

		// TODO: Implement your save logic here
		console.log('Saving changes:', changes);

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
