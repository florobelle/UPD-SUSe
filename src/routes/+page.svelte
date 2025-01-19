<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div
	class="via relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#fefaf7]"
>
	<div class="flex h-screen w-[80%] justify-center pt-32">
		<!-- Go to specific library -->
		<div class="flex w-3/5 flex-col gap-8">
			<div class="flex w-full flex-col gap-4 text-center">
				<h1 class="text-5xl font-medium">
					SUSê: A <span class="text-[#f48444]">Seamless</span>,
					<span class="text-[#f48444]">Ubiquitous</span>, <span class="text-[#f48444]">Secure</span>
					and <span class="text-[#f48444]">Efficient</span> system!
				</h1>
				<h2 class="text-lg font-normal">Choose the library you want to avail a service in.</h2>
			</div>
			<div class="flex flex-row justify-center gap-2">
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
	<img
		src="../../photos/landingpage.png"
		class="absolute -bottom-60 m-auto h-auto w-[68%] rounded-xl border border-slate-100 shadow-2xl"
		alt="service"
	/>
</div>
