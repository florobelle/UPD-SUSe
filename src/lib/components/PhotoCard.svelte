<script lang="ts">
	import MapPin from 'lucide-svelte/icons/map-pin';

	let imgSrc = 'photos/AECH.jpeg';
	let libName = 'Engineering Library II';
	let libBuilding = 'G/F UP Alumni Engineers Centennial Hall';
	let libStreet = 'Velasquez St., UP Diliman';
</script>

<div class="relative mx-auto h-full w-full overflow-hidden rounded-[10px]">
	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-[#FF8000]/25 to-[#34C370]/10"></div>
	<!-- Image -->
	<img src={imgSrc} alt="The engineering library building" class="h-full object-cover" />
	<!-- Blur -->
	<div
		class="overlay-blur bg-[#D9D9D9]/.20 absolute inset-x-0 bottom-0 h-1/3 w-full rounded-t-[2000px] backdrop-blur-lg"
	></div>
	<!-- Blur -->
	<div class="gap-[20px absolute inset-x-0 bottom-0 flex w-full flex-col gap-8 p-10 text-center">
		<div class="flex w-full items-center justify-center gap-4">
			<MapPin size="36" strokeWidth="2" color="#ffffff" />
			<p class="text-4xl font-medium text-white">{libName}</p>
		</div>
		<p class="text-lg font-normal text-white/[.80]">
			{libBuilding}<br />
			{libStreet}
		</p>
	</div>
</div>

<style>
	.overlay-blur {
		mask-image: radial-gradient(
			ellipse 90% 100% at center 75%,
			black 40%,
			rgba(0, 0, 0, 0.2) 60%,
			rgba(0, 0, 0, 0) 100%
		);
		mask-size: 100% 100%;
	}
</style>
