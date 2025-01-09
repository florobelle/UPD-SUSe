<script lang="ts">
	import { MoveUpRight } from 'lucide-svelte';

	const {
		selectService,
		serviceImgSrc = '../../services/calculator.png',
		serviceName = 'Calculator',
		avalableNum = '3',
		selected = false,
		inUse = false
	} = $props();
</script>

<button class="h-[300px] w-full text-left" onclick={selectService}>
	<div
		class={`group relative h-full w-full cursor-pointer overflow-hidden rounded-[20px] bg-gradient-to-br from-[#FFA040] to-[#E1E1E1] p-[1px] `}
	>
		<!-- Solid Overlay -->
		<div
			class={`absolute inset-0 h-full w-full rounded-[20px] bg-gradient-to-br from-[#D8D8D8] to-[#E1E1E1] group-hover:opacity-0`}
		></div>

		<!-- Content Container -->
		<div
			class={`relative flex h-full w-full flex-col gap-8 overflow-hidden rounded-[18px] p-6 ${inUse ? 'via-54% bg-white bg-gradient-to-br from-[#FF8200] via-[#FFBD72] to-[#FFBD72]/30 ' : 'via-78% bg-white bg-gradient-to-br from-[#FFFFFF]/10 via-[#FAE3CF]/10 to-[#FF9035]/30'}`}
		>
			<!-- BACKGROUND OVERLAY -->
			<div
				class="absolute inset-0 h-full w-full rounded-[18px] ${inUse
					? 'via-54% bg-white bg-gradient-to-br from-[#FF8200] via-[#FFBD72] to-[#FFBD72]/30 '
					: 'bg-white'} group-hover:opacity-0"
			></div>

			<!-- TEXT -->
			<div class="z-10 flex w-full">
				<div class="flex flex-col gap-1">
					<h2 class={`text-xl font-medium ${inUse ? 'text-white' : ''}`}>{serviceName}</h2>
					<p class={`text-base ${inUse ? 'text-white' : 'text-[#656565]'}`}>
						{avalableNum} available
					</p>
				</div>

				{#if !inUse}<div
						class="once group-hover:animate-spin-once invisible ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#656565] group-hover:visible"
					>
						<MoveUpRight></MoveUpRight>
					</div>
				{:else}<div
						class="once ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white group-hover:visible"
					>
						<div class="h-4 w-4 rounded-sm bg-[#FF7700]"></div>
					</div>
				{/if}
			</div>

			<!-- IMAGE -->
			<div class="absolute -bottom-5 -right-5">
				<img src={serviceImgSrc} class="m-2 h-auto w-[200px]" alt="service" />
			</div>
		</div>
	</div>
</button>
