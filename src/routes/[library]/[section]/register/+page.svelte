<script lang="ts">
	// UI Component Imports
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';

	// Form Imports
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// Combobox Imports (User Type, College and Program Comboboxes)
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import PopoverContent from '$lib/components/ui/popover/popover-content.svelte';
	import Check from 'lucide-svelte/icons/check';
	import { userTypes } from '$lib/stores/userTypes';
	import {
		allPrograms,
		allColleges,
		collegeProgramsList,
		type College
	} from '$lib/stores/collegePrograms';

	// Login Imports
	import { UserStore } from '$lib/stores/UserStore';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { sendOtp } from '../../../supabase/LoginReg';

	// ----------------------------------------------------------------------------
	// COMBOBOXES (Dropdowns for User Type, Colleges and Programs)
	// ----------------------------------------------------------------------------
	// Combobox variables
	let userTypeOpen = false; //determines if the user type combobox is open
	let programOpen = false; //determines if the college program combobox is open
	let collegeOpen = false; //determines if the college combobox is open
	let searchProgram: string = ''; //search term for the program
	let searchCollege: string = ''; //search term for the college

	// Combobox filter functions

	function filterCollegePrograms(
		collegeProgramsList: College[],
		searchTerm: string,
		selectedCollege: string
	): College[] {
		// Function that filters the programs in the programs combobox based on:
		// 1. The search term in the input
		// 2. The selected college (if there is)

		const normalizedSearchTerm = searchTerm.toLowerCase();

		return collegeProgramsList
			.map((college) => {
				// only include results in the same college selected
				if (selectedCollege !== college.value && selectedCollege != undefined) {
					return null;
				}

				// only include programs that match the search term
				const filteredPrograms = college.programs.filter((program) =>
					program.label.toLowerCase().includes(normalizedSearchTerm)
				);

				if (filteredPrograms.length > 0) {
					return {
						...college,
						programs: filteredPrograms
					};
				}

				return null;
			})
			.filter(Boolean) as College[];
	}

	function filterColleges(
		allColleges: { label: string; value: string }[],
		collegeSearchTerm: string
	): { label: string; value: string }[] {
		// Function that filters the colleges in the college combobox based on:
		// 1. The search term in the input

		const normalizedSearchTerm = collegeSearchTerm.toLowerCase();

		return allColleges.filter((college) =>
			college.label.toLowerCase().includes(normalizedSearchTerm)
		);
	}

	// Combobox filtered stores
	$: filteredPrograms = filterCollegePrograms(
		collegeProgramsList,
		searchProgram,
		$formData.college
	);

	$: filteredColleges = filterColleges(allColleges, searchCollege);

	// ----------------------------------------------------------------------------
	// FORM
	// ----------------------------------------------------------------------------
	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	// $: console.log($formData);

	// ----------------------------------------------------------------------------
	// BACKEND
	// ----------------------------------------------------------------------------
	$formData.userName = $UserStore.formData.userName ? $UserStore.formData.userName : ''; // Auto-inputs the username if user picked Login with UP Mail

	// Returns to Login if both username and rfid are lost after page refresh
	if (browser && !$UserStore.formData.rfid && !$UserStore.formData.userName) {
		goto('./login');
	}

	async function saveFormData() {
		// Saves user data in the User Store for inserting in the database once user has been authenticated
		$UserStore.toRegister = true;
		$UserStore.formData = {
			rfid: $UserStore.formData.rfid,
			userName: $formData.userName,
			firstName: $formData.firstName,
			middleName: $formData.middleName,
			lastName: $formData.lastName,
			phoneNum: $formData.phoneNum,
			userType: $formData.userType,
			college: $formData.college,
			program: $formData.program,
			IDNum: $formData.IDNum
		};

		if (await sendOtp($formData.userName)) {
			goto('./verify-otp');
		} else {
			goto('./login');
		}
		return;
	}
</script>

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
				<!-- Row 1: Name -->
				<div class="grid grid-cols-6 gap-4">
					<Form.Field {form} class="col-span-3" name="firstName">
						<Form.Control let:attrs>
							<Form.Label>First Name</Form.Label>
							<Input {...attrs} bind:value={$formData.firstName} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} class="col-span-1" name="middleName">
						<Form.Control let:attrs>
							<Form.Label>M.I.</Form.Label>
							<Input {...attrs} bind:value={$formData.middleName} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} class="col-span-2" name="lastName">
						<Form.Control let:attrs>
							<Form.Label>Last Name</Form.Label>
							<Input {...attrs} bind:value={$formData.lastName} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<!-- Row 2: ID Number and Phone Number -->
				<div class="grid grid-cols-2 gap-4">
					<!-- Phone Number -->
					<Form.Field {form} class="col-span-1" name="phoneNum">
						<Form.Control let:attrs>
							<Form.Label>Phone Number</Form.Label>
							<Input {...attrs} bind:value={$formData.phoneNum} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- User Type -->
					<Form.Field {form} name="userType" class="col-span-1 mt-2 flex flex-col">
						<Popover.Root bind:open={userTypeOpen}>
							<Form.Control let:attrs>
								<Form.Label>User Type</Form.Label>
								<Popover.Trigger
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-between',
										!$formData.userType && 'text-muted-foreground'
									)}
									role="combobox"
									{...attrs}
								>
									<p class="truncate">
										{userTypes.find((f) => f.value === $formData.userType)?.label ??
											'Select user type'}
									</p>
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Popover.Trigger>
								<input hidden value={$formData.userType} name={attrs.name} />
							</Form.Control>

							<PopoverContent>
								<Command.Root shouldFilter={false}>
									<Command.Empty>No program found.</Command.Empty>
									<Command.List>
										<Command.Group>
											{#each userTypes as userType}
												<Command.Item
													value={userType.label}
													onSelect={() => {
														$formData.userType = userType.value;
														userTypeOpen = false;
													}}
												>
													{userType.label}
													<Check
														class={cn(
															'ml-auto h-4 w-4',
															userType.value !== $formData.userType && 'text-transparent'
														)}
													/>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</PopoverContent>
						</Popover.Root>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<!-- Row 4: College, Department, Type -->
				<div class="grid grid-cols-2 gap-4">
					<!-- College -->
					<Form.Field {form} name="college" class="col-span-1 mt-2 flex flex-col">
						<Popover.Root bind:open={collegeOpen}>
							<Form.Control let:attrs>
								<Form.Label>College</Form.Label>
								<Popover.Trigger
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-between',
										!$formData.college && 'text-muted-foreground'
									)}
									role="combobox"
									{...attrs}
								>
									<p class="truncate">
										{allColleges.find((f) => f.value === $formData.college)?.label ??
											'Select college'}
									</p>
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Popover.Trigger>
								<input hidden value={$formData.college} name={attrs.name} />
							</Form.Control>

							<PopoverContent>
								<Command.Root shouldFilter={false}>
									<Command.Input
										autofocus
										bind:value={searchCollege}
										placeholder="Search college"
									/>
									<Command.Empty>No program found.</Command.Empty>
									<Command.List>
										<Command.Group>
											{#each filteredColleges as college}
												<Command.Item
													value={college.label}
													onSelect={() => {
														// if different, then remove the program selected
														if ($formData.college !== college.value) {
															$formData.program = '';
														}
														$formData.college = college.value;
														collegeOpen = false;
													}}
												>
													{college.label}
													<Check
														class={cn(
															'ml-auto h-4 w-4',
															college.value !== $formData.college && 'text-transparent'
														)}
													/>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
							</PopoverContent>
						</Popover.Root>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Program -->
					<Form.Field {form} name="program" class="col-span-1 mt-2 flex flex-col">
						<Popover.Root bind:open={programOpen}>
							<Form.Control let:attrs>
								<Form.Label>College Program</Form.Label>
								<Popover.Trigger
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'w-full justify-between',
										!$formData.program && 'text-muted-foreground'
									)}
									role="combobox"
									{...attrs}
								>
									<p class="truncate">
										{allPrograms.find((f) => f.value === $formData.program)?.label ??
											'Select program'}
									</p>

									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Popover.Trigger>
								<input hidden value={$formData.program} name={attrs.name} />
							</Form.Control>

							<PopoverContent>
								<Command.Root shouldFilter={false}>
									<Command.Input
										autofocus
										bind:value={searchProgram}
										placeholder="Search programs"
									/>
									<Command.Empty>No program found.</Command.Empty>
									<Command.List>
										{#each filteredPrograms as college}
											<Command.Group heading={college.label}>
												{#each college.programs as program}
													<Command.Item
														value={program.label}
														onSelect={() => {
															// if a program is selected, assign the college automatically
															$formData.program = program.value;
															$formData.college = college.value;
															programOpen = false;
														}}
													>
														{program.label}
														<Check
															class={cn(
																'ml-auto h-4 w-4',
																program.value !== $formData.program && 'text-transparent'
															)}
														/>
													</Command.Item>
												{/each}
											</Command.Group>
										{/each}
									</Command.List>
								</Command.Root>
							</PopoverContent>
						</Popover.Root>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<!-- ID Number -->
					<Form.Field {form} class="col-span-1" name="IDNum">
						<Form.Control let:attrs>
							<Form.Label>ID Number</Form.Label>
							<Input {...attrs} bind:value={$formData.IDNum} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<!-- Email -->
					<Form.Field {form} class="col-span-1" name="userName">
						<Form.Control let:attrs>
							<Form.Label>Email</Form.Label>
							<div class="flex items-center rounded-r-md bg-zinc-100">
								<Input {...attrs} class="rounded-r-none" bind:value={$formData.userName} />
								<div class="px-2">
									<p class="text-sm">@up.edu.ph</p>
								</div>
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
