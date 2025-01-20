<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import toast from "svelte-5-french-toast";

	import { UserStore } from "$lib/stores/UserStore";
	import { linkRfid } from "../../../../supabase/LoginReg";
	// ----------------------------------------------------------------------------
	// RFID LINKING
	// ----------------------------------------------------------------------------
	let rfid: string = ''; // rfid linking

	async function checkRfidEnter(event: KeyboardEvent) {
		// checks once RFID has been entered
		if (event.key == 'Enter') {
			const { error } = await linkRfid(rfid, $UserStore.formData.username);
			if (error) {
				toast.error(`Error with linking RFID: ${error}`);
			} else {
				toast.success('Successful RFID linking!');
			}
		}
		return;
	}
</script>

<Input
	type="text"
	bind:value={rfid}
    on:keyup={checkRfidEnter}
	placeholder="••••••••••"
	class="max-w-full text-center text-base"
/>