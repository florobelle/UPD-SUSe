<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';

	// Backend Imports
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { verifyAdmin } from '../../../../supabase/LoginReg';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let otp: string = '';

	// ----------------------------------------------------------------------------

	// Returns to Login if both username and rfid are lost after page refresh
	if (browser && !$AdminStore.formData.email) {
		goto('./login');
	}

	async function checkOtpEnter() {
		// Listens to input in the OTP field
		if (otp.length == 6) {
            const loadID: string = toast.loading('Verifying OTP...');
			const { error } = await verifyAdmin(
				otp,
				$AdminStore.formData.email,
				$AdminStore.toRegister,
				$AdminStore.formData
			);
			if (error) {
				toast.dismiss(loadID);
				toast.error(`Error with verifying OTP: ${error}`);
				goto('./login');
			} else {
				toast.dismiss(loadID);
				goto('../admin-dashboard');
			}
		}

		return;
	}
</script>

<Toaster />

<!-- Select library and section to proceed to enable the website -->
<div class="flex flex-col items-center">
	<div class="flex w-full flex-col gap-4">
		<!-- Login with RFID -->
		<div class="flex w-full flex-col gap-8">
			<div class="flex w-full flex-col gap-4 text-center">
				<h1 class="text-5xl font-medium">Enter the OTP sent to your UP Mail</h1>
				<h2 class="text-lg font-normal">
					The One-Time Password has been sent to your email! Please check the spam folder if it
					doesn't appear in your inbox.
				</h2>
			</div>
			<Input
				type="text"
				placeholder="123456"
				bind:value={otp}
				on:keyup={checkOtpEnter}
				class="max-w-full text-center text-base"
			/>
		</div>
	</div>
</div>
