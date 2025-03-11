<script lang="ts">
	// Credits for the html and css to https://codepen.io/aaroniker/pen/mdyYBPP
	export let answer: string;
	export let questionName: string;
</script>

<div class="feedback w-full flex grow items-top text-center justify-left gap-4" on:change>
	<div class="mr-4 flex flex-col items-center gap-1.5">
		<input type="radio" value="1" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500 max-w-[60px]">Strongly Disagree</p>
	</div>
	<div class="mr-4 flex flex-col items-center gap-1.5">
		<input type="radio" value="2" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500 max-w-[60px]">Disagree</p>
	</div>
	<div class="mr-4 flex flex-col items-center gap-1.5">
		<input type="radio" value="3" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500 max-w-[60px]">Agree</p>
	</div>
	<div class="mr-4 flex flex-col items-center gap-1.5">
		<input type="radio" value="4" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500 max-w-[60px]">Strongly Agree</p>
	</div>
	<div class="mr-4 flex flex-col items-center gap-1.5">
		<input type="radio" value="0" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500 max-w-[60px]">N/A</p>
	</div>
</div>
