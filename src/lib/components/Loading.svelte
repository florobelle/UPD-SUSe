<script>
	import { fly } from 'svelte/transition';

	export let loadingText = 'Loading';
	export let loading = true;
	export let minLoadTime = 1000;

	let isLoading = true;

	$: if (!loading) {
		setTimeout(() => {
			isLoading = false;
		}, minLoadTime);
	}
</script>

{#if isLoading}
	<div
		in:fly={{ y: -1000, duration: 300, opacity: 1 }}
		out:fly={{ y: 1000, duration: 500, opacity: 1 }}
		class="dark:bg-dark-background fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center gap-4 bg-white"
	>
		<p>{loadingText}</p>
		<span class="loader"></span>
	</div>
{/if}

<style>
	.loader {
		width: 100%;
		height: 2.5px;
		position: relative;
		background: #ededed;
		overflow: hidden;
	}

	.loader::after {
		content: '';
		width: 100%;
		height: 100%;
		background: #808080;
		position: absolute;
		top: 0;
		left: -100%;
		animation: animation-loader 2s ease-in-out infinite;
		box-sizing: border-box;
	}

	@keyframes animation-loader {
		0% {
			left: -100%;
			transform: translateX(0);
		}
		100% {
			left: 100%;
			transform: translateX(0);
		}
	}
</style>
