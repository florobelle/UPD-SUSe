<script lang="ts">
	import { navigating } from '$app/stores';
	import Loading from '$lib/components/Loading.svelte';

	// UI Component Imports
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	import { AdminStore } from '$lib/stores/AdminStore.js';
	export let data;
	let clickCount = 0;

	function checkAdminLogin() {
		// Enables Admins to log in after 5 clicks
		clickCount++;
		if (clickCount == 5) {
			$AdminStore.toLogin = true;
			clickCount = 0;
		}
	}
</script>

<section class="grid h-screen max-h-dvh grid-cols-2">
	<!-- Photocard -->
	<div class="h-full p-4">
		<PhotoCard
			libSrc={data.librarySrc}
			libName={data.libraryName}
			libStreet={data.libraryStreet}
			libBuilding={data.libraryBuilding}
		></PhotoCard>
	</div>

	<!-- Register/Login -->
	<div class="flex h-full w-full flex-col items-center justify-center p-4">
		<!-- Logo header -->
		<div class="items-right flex h-[50px] w-full justify-end gap-4">
			<img
				src="../../../logos/up-logo.png"
				class="h-full w-auto"
				alt="University of the Philippines logo"
			/>
			<img
				src="../../../logos/dcs-logo.png"
				class="h-full w-auto"
				alt="Department of Computer Science logo"
			/>
			<button class="cursor-default" on:click={checkAdminLogin}>
				<img
					src="../../../logos/engglib-logo.png"
					class="h-full w-auto"
					alt="Engineering Library logo"
				/>
			</button>
		</div>

		<!-- Register/Login -->
		<div class="flex h-[90%] w-[80%] items-center justify-center">
			<Loading loadingText={'Thanks for using SUSê!'} loading={Boolean($navigating)} />
			<slot></slot>
		</div>
	</div>
</section>
