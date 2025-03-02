<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div
	class="via flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#fefaf7]"
>
	<div class="flex h-screen flex-col items-center justify-center pt-32 xl:w-[80%]">
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
					}}>EnggLib I Circulation</Button
				>
				<Button
					on:click={() => {
						goto('/engglib1/ground-floor-services/auth/login');
					}}>EnggLib I GFS</Button
				>
				<Button
					on:click={() => {
						goto('/engglib2/circulation/auth/login');
					}}>EnggLib II Circulation</Button
				>
				<Button
					on:click={() => {
						goto('/engglib2/the-learning-commons/auth/login');
					}}>EnggLib II TLC</Button
				>
			</div>
		</div>
		<img
			src="../../photos/landingpage.png"
			class="m-auto mt-20 h-auto w-[90%] rounded-xl border border-slate-100 shadow-2xl xl:w-[68%]"
			alt="service"
		/>
	</div>
</div>
