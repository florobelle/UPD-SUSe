<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';
	import toast from 'svelte-5-french-toast';
	import { updateAdmin } from '../../../../routes/supabase/Admin';

	export let id: number;
	export let row: any;
	export let isActive: boolean;

	async function handleToggle() {
        // activates or deactivates an admin
		isActive = !isActive;
        const loadID: string = toast.loading('Updating admin status...');
        const { error } = await updateAdmin({ is_active: isActive }, '', id);

		if (error) {
            isActive = !isActive;
			toast.error(`Error with updating admin with id ${id}: ${error}`);
        } else {
            toast.success("Successfully updated admin status!");
        }
        toast.dismiss(loadID);
        return;
	}
</script>

<!-- {#if !isApproved} -->
	<div class="flex flex-row gap-2">
		<Switch checked={isActive} onCheckedChange={handleToggle} />
	</div>
<!-- {:else}
	<div></div>
{/if} -->
