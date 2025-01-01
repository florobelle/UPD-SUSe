<script lang="ts">
	import '../app.css';
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	// let { children } = $props();
</script>

<!-- {@render children()} -->
<section class="w-max-screen grid h-screen grid-cols-2">
	<!-- Photocard -->
	<div class="h-full p-4">
		<PhotoCard></PhotoCard>
	</div>
	<!-- Login/Register -->
	<div><slot></slot></div>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
</style>
