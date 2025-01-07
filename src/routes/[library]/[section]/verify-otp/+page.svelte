<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';

	// Backend Imports
	import { Toaster } from 'svelte-5-french-toast';
	import { loginOtp } from '../../../supabase/LoginReg';
	import { UserStore } from '$lib/stores/UserStore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let otp: string = '';

	// ----------------------------------------------------------------------------

	// Returns to Login if both username and rfid are lost after page refresh
	if (browser && !$UserStore.formData.username) {
		goto('./login');
	}

	async function checkOtpEnter(event: KeyboardEvent) {
		// Listens to input in the OTP field
		if (event.key == 'Enter') {
			if (
				await loginOtp(
					otp,
					$UserStore.formData.username,
					$UserStore.toRegister,
					$UserStore.formData
				)
			) {
				goto('./student-dashboard');
			} else {
				goto('./login');
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
				<h2 class="text-lg font-normal">The One-Time Password has been sent to you UP Mail!</h2>
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
