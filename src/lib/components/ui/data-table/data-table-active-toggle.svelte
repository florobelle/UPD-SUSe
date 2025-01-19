<script lang="ts">
	import { Switch } from '$lib/components/ui/switch';

	export let id: number;
	export let row: any;
	export let isApproved: boolean;
	let isActive: boolean = false;

	async function handleToggle() {
		isActive = !isActive;

		try {
			// call the backend to update!
			console.log(isActive, id);
		} catch (error) {
			isActive = !isActive;
		}
	}
</script>

{#if !isApproved}
	<div class="flex flex-row gap-2">
		<Switch checked={isActive} onCheckedChange={handleToggle} />
	</div>
{:else}
	<div></div>
{/if}
