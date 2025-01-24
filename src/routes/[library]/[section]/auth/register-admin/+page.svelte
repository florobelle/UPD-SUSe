<script lang="ts">
	// UI Component Imports
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form';

	// Form Imports
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// Login Imports
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { AdminStore } from '$lib/stores/AdminStore';
	import { page } from '$app/stores';
	import { signUpAdmin } from '../../../../supabase/LoginReg';


	// ----------------------------------------------------------------------------
	// FORM
	// ----------------------------------------------------------------------------
	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	// ----------------------------------------------------------------------------
	// BACKEND
	// ----------------------------------------------------------------------------

    const routes: Array<string> = $page.url.pathname.split('/');
	const library: string = routes[1]; // session
	const section: string = routes[2]; // session

	// Returns to Login if rfid is lost after page refresh
	if (browser && !$AdminStore.formData.rfid) {
		goto(`/${library}/${section}/auth/login`);
	}

	async function saveFormData() {
		// Saves user data in the User Store for inserting in the database once user has been authenticated
		const loadID: string = toast.loading('Registering...');
		$AdminStore.toRegister = true;
		$AdminStore.formData = {
            admin_id: 0,
            rfid: $AdminStore.formData.rfid,
            nickname: $formData.nickname,
            is_approved: false,
            email: $formData.email,
            library: library == 'engglib1' ? '1' : '2',
            section: '1'
		};

		const { error } = await signUpAdmin($formData.email);
		if (error) {
			toast.error(`Error with sending OTP: ${error}`);
		} else {
			goto(`/${library}/${section}/auth/verify-otp-admin`);
		}
        toast.dismiss(loadID);
		return;
	}
</script>

<Toaster />

<!-- Register -->
<div class="flex h-[90%] w-[80%] items-center">
	<!-- Register Form -->
	<div class="flex w-full flex-col gap-12">
		<!-- Register Form Title -->
		<div class="flex w-full flex-col gap-4">
			<h1 class="text-5xl font-medium">Register</h1>
		</div>

		<!-- <Separator /> -->

		<!-- Register Form Inputs-->
		<form
			method="POST"
			on:submit={(event) => {
				event.preventDefault();
			}}
			class="grid w-full gap-12"
			use:enhance
		>
			<div class="grid-rows grid gap-0">
				<div class="grid grid-cols-2 gap-4">
                    <!-- Nickname -->
					<Form.Field {form} name="nickname">
						<Form.Control let:attrs>
							<Form.Label>Nickname</Form.Label>
							<Input {...attrs} bind:value={$formData.nickname} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
                    <!-- Email -->
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label>Email</Form.Label>
							<div class="flex items-center rounded-r-md bg-zinc-100">
								<Input {...attrs} class="rounded-r-none" bind:value={$formData.email} />
							</div>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
			<!-- <Separator /> -->

			<!-- Button Actions -->
			<div class="grid w-full gap-2">
				<Form.Button on:click={saveFormData} class="flex gap-2">
					<p class="text-base">Register</p>
				</Form.Button>
				<Form.Button href="./login" variant="outline" class="flex gap-2">
					<p class="text-base">Cancel</p>
				</Form.Button>
			</div>
		</form>
	</div>
</div>
