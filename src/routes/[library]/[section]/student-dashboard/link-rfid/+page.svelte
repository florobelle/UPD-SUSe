<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import toast from "svelte-5-french-toast";

	import { UserStore } from "$lib/stores/UserStore";
	import { linkRfid } from "../../../../supabase/LoginReg";
	// ----------------------------------------------------------------------------
	// RFID LINKING
	// ----------------------------------------------------------------------------
	let rfid: string = ''; // rfid linking

	async function checkRfidEnter() {
		// checks once RFID has been entered
		if (rfid.length == 10) {
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


<h1 class="text-3xl font-medium">
    Please tap your UP ID to link it to your account!
</h1>

<Input
	type="text"
	bind:value={rfid}
    on:keyup={checkRfidEnter}
    maxlength={10}
	placeholder="••••••••••"
	class="max-w-full text-center text-base"
/>