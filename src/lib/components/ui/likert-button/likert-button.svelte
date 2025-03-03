<script lang="ts">
	// Credits for the html and css to https://codepen.io/aaroniker/pen/mdyYBPP
	export let answer: string;
	export let questionName: string;
</script>

<div class="feedback w-full flex grow items-center justify-center">
	<div class="mr-4 flex flex-col items-center">
		<input type="radio" value="1" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500">Strongly Disagree</p>
	</div>
	<div class="mr-4 flex flex-col items-center">
		<input type="radio" value="2" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500">Disagree</p>
	</div>
	<div class="mr-4 flex flex-col items-center">
		<input type="radio" value="3" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500">Agree</p>
	</div>
	<div class="mr-4 flex flex-col items-center">
		<input type="radio" value="4" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500">Strongly Agree</p>
	</div>
	<div class="mr-4 flex flex-col items-center">
		<input type="radio" value="0" bind:group={answer} name={questionName} class="size-6" />
		<p class="text-sm text-slate-500">N/A</p>
	</div>
</div>
