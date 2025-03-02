<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import EmojiButton from '$lib/components/ui/emoji-button/emoji-button.svelte';
	import LikertButton from '$lib/components/ui/likert-button/likert-button.svelte';

	const surveyAns = {
        ans1: 0,
        ans2: 0,
        ans3: 0,
        ans4: 0,
        
        ans5: 0,
        ans6: 0,

        ans7: 0,
        ans8: 0,
        ans9: 0,
        ans10: 0,
        
        ans11: 0,
        ans12: 0,
        ans13: 0,
        ans14: 0,
        ans15: 0,    
        
        ans16: 0,
        ans17: 0,
        ans18: 0,
        
        ans19: 0,
        ans20: 0,
        ans21: 0,
        
        ans22: 0,
        ans23: 0,
        ans24: 0,
        ans25: 0,
    }

    function submitFeedbackForm() {
        console.log(surveyAns)
    }

    function submitBugReport() {
        console.log(surveyAns)
    }
</script>

<ScrollArea class="">
	<div class="flex h-full w-full flex-col gap-10 p-10 md:p-20">
		<!-- Title -->
		<div class="flex w-full flex-col gap-4">
			<h1 class="text-3xl font-medium">We would love to hear your thoughts!</h1>
			<p class="text-slate-500">
				SUSê is built by students, for the students. Any feedback makes SUSê better.
			</p>
		</div>

		<!-- Tabs -->
		<Tabs.Root value="feedback" class="">
			<Tabs.List class="grid max-w-[300px] grid-cols-2">
				<Tabs.Trigger value="feedback">Feedback</Tabs.Trigger>
				<Tabs.Trigger value="bug-report">Bug Report</Tabs.Trigger>
			</Tabs.List>
			<!-- Feedback Form -->
			<Tabs.Content value="feedback">
				<Card.Root>
					<Card.Header>
						<Card.Title>Feedback</Card.Title>
						<Card.Description>We’d love to hear your thoughts about SUSe!</Card.Description>
					</Card.Header>

					<Card.Content class="flex flex-col gap-4 space-y-2">
						<div class="grid w-full gap-8">
							<Label for="feedback">SUSê has a simple but modern layout and design.</Label>
							<LikertButton bind:answer={surveyAns.ans1} />
						</div>

						<div class="grid w-full gap-8">
							<Label for="feedback">How satisfied are you with SUSê overall?</Label>
							<!-- <EmojiButton bind:rating /> -->
						</div>
					</Card.Content>

					<Card.Footer>
						<Button class="max-w-[150px]" on:click={submitFeedbackForm}>Send Bug Report</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
			<!-- Bug Report -->
			<Tabs.Content value="bug-report">
				<Card.Root>
					<Card.Header>
						<Card.Title>Bug Report</Card.Title>
						<Card.Description>
							We are working hard to make SUSê better! We appreciate any bugs 🐛 that you can find.
						</Card.Description>
					</Card.Header>

					<Card.Content class="flex flex-col gap-4 space-y-2">
						<div class="grid w-full gap-1.5">
							<Label for="bug-report">What issue did you encounter?</Label>
							<Textarea
								placeholder="Please be as decriptive as you can when describing the bug you encountered."
							/>
						</div>

						<div class="grid w-full gap-1.5">
							<Label for="bug-steps">Can you describe the steps you took to cause the bug?</Label>
							<Textarea
								placeholder="This will help the developers recreate the bug and find what's causing the issue faster!"
							/>
						</div>
					</Card.Content>
					<Card.Footer>
						<Button class="max-w-[150px]" on:click={submitBugReport}>Send Bug Report</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</ScrollArea>
