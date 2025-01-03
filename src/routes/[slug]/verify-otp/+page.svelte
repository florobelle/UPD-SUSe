<script lang="ts">
	// UI Imports
	import { Input } from '$lib/components/ui/input';

	// Backend Imports
	import { UserStore } from '$lib/stores/User';
	import { supabaseClient } from '$lib/client/SupabaseClient';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { goto } from '$app/navigation';

	let otp: string = '';

	// -----

    async function loginOtp(otp: string) {
        // Logs in using user email with OTP
		const { data, error } = await supabaseClient.auth.verifyOtp({
			email: `${$UserStore.username}@up.edu.ph`,
			token: otp,
			type: 'email'
		});
        console.log(data);

		if (error) {
			toast.error(`Error with verifying OTP: ${error}`);
            return
		}
        goto('./student-dashboard');
    }

    function checkOtpEnter(event: KeyboardEvent) {
        // Listens to input in the OTP field
		if (event.key == 'Enter') {
			loginOtp(otp);
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
                    The One-Time Password has been sent to you UP Mail!
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
