<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';

	import { UserStore } from '$lib/stores/UserStore';
	import { linkRfid } from '../../../../supabase/LoginReg';
	import { convertRfidInt } from '$lib/utilsBack';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	// ----------------------------------------------------------------------------
	// RFID LINKING
	// ----------------------------------------------------------------------------
	let rfidGlobal: string = ''; // rfid linking
	let rfidConverted: string = '';
	let checkCallCount: number = 0;

	async function checkRfidEnter() {
		// checks once RFID has been entered
		if (checkCallCount == 1) {
			const { error } = await linkRfid(rfidConverted, $UserStore.formData.username);
			rfidGlobal = '';
			rfidConverted = '';
			if (error) {
				toast.error(`Error with linking RFID: ${error}`);
			} else {
				toast.success('Successful RFID linking!');
			}
			checkCallCount = 0;
		}
		return;
	}

	function handleKeydownRfid() {
		// Listens to input in the RFID field
		if (rfidGlobal.length == 10) {
			if (rfidGlobal.match(/[a-fA-F]+/i)) {
				rfidConverted = convertRfidInt(rfidGlobal);
			} else {
				rfidConverted = rfidGlobal;
			}

			checkCallCount++;
			checkRfidEnter();
		}
	}

	// Functions for selecting and deselecting text boxes
	function selectText(id: string) {
		if (browser) {
			const input = document.getElementById(id) as HTMLElement | null;
			if (input) {
				input.focus();
			}
		}
	}

	function deselectText(id: string): void {
		if (browser) {
			const input = document.getElementById(id) as HTMLElement | null;
			if (input) {
				input.blur();
			}
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT') {
			event.preventDefault();
		}
	}

	// Lifecycle management
	onMount(() => {
		if (browser) {
			selectText('userRfid');
			document.addEventListener('mousedown', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('mousedown', handleClickOutside);
		}
	});
</script>

<Toaster />

<div class="flex h-full w-full flex-col gap-10 p-20">
	<h1 class="text-3xl font-medium">Please tap your UP ID to link it to your account!</h1>

	<Input
		id="userRfid"
		type="text"
		bind:value={rfidGlobal}
		on:keyup={handleKeydownRfid}
		maxlength={10}
		placeholder="••••••••••"
		class="max-w-full text-center text-base"
	/>
</div>
