<script lang="ts">
	// Credits for the html and css to https://codepen.io/aaroniker/pen/mdyYBPP
	export let answer: number;
</script>

<div class="feedback grid grid-cols-4 w-full items-center justify-center w-[50%]">
    <div class="flex flex-col items-center">
        <input type="radio" value="1" bind:group={answer} name="feedback" class="size-6"/>
        <p class="text-sm text-slate-500">Strongly Disagree</p>
    </div>
    <div class="flex flex-col items-center">
        <input type="radio" value="2" bind:group={answer} name="feedback" class="size-6"/>
        <p class="text-sm text-slate-500">Disagree</p>
    </div>
    <div class="flex flex-col items-center">
        <input type="radio" value="4" name="feedback" bind:group={answer} class="size-6"/>
        <p class="text-sm text-slate-500">Agree</p>
    </div>
    <div class="flex flex-col items-center">
        <input type="radio" value="5" bind:group={answer} name="feedback" class="size-6"/>
        <p class="text-sm text-slate-500">Strongly Agree</p>
    </div>
</div>
