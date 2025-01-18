<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex h-full w-full flex-col items-center justify-center p-4">
	<div class="flex h-screen w-[80%] items-center justify-center">
		<div class="flex flex-col items-center">
			<div class="flex w-full flex-col gap-4">
				<!-- Go to specific library -->
				<div class="flex w-full flex-col gap-8">
					<div class="flex w-full flex-col gap-4 text-center">
						<h1 class="text-5xl font-medium">Welcome to SUSê!</h1>
						<h2 class="text-lg font-normal">
							Choose the library you want to avail a service in.
						</h2>
					</div>
					<div class="flex flex-col gap-2">
						<Button
							on:click={() => {
								goto('/engglib1/circulation/auth/login');
							}}>Engineering Library I</Button
						>
						<Button
							on:click={() => {
								goto('/engglib2/circulation/auth/login');
							}}>Engineering Library II</Button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
