<script lang="ts">
	// UI Component Imports
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	export let data: {
		libName: string;
		libBuilding: string;
		libStreet: string;
		libSrc: string;
	};

	// console.log(data);
</script>

<section class="grid h-screen max-h-dvh grid-cols-2">
	<!-- Photocard -->
	<div class="h-full p-4">
		<PhotoCard
			libSrc={data.libSrc}
			libName={data.libName}
			libStreet={data.libStreet}
			libBuilding={data.libBuilding}
		></PhotoCard>
	</div>

	<!-- Register/Login -->
	<div class="flex h-full w-full flex-col items-center justify-center p-4">
		<!-- Logo header -->
		<div class="items-right flex h-[50px] w-full justify-end gap-4">
			<img
				src="../logos/up-logo.png"
				class="h-full w-auto"
				alt="University of the Philippines logo"
			/>
			<img
				src="../logos/dcs-logo.png"
				class="h-full w-auto"
				alt="Department of Computer Science logo"
			/>
			<img src="../logos/engglib-logo.png" class="h-full w-auto" alt="Engineering Library logo" />
		</div>

		<!-- Register/Login -->
		<div class="flex h-[90%] w-[80%] items-center justify-center">
			<slot></slot>
		</div>
	</div>
</section>
