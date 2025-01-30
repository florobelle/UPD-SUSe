<script>
	import Input from '$lib/components/ui/input/input.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import EmojiButton from '$lib/components/ui/emoji-button/emoji-button.svelte';
</script>

<ScrollArea class="h-screen">
	<div class="flex h-full w-full flex-col gap-10 p-20">
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
			<Tabs.Content value="feedback">
				<Card.Root>
					<Card.Header>
						<Card.Title>Feedback</Card.Title>
						<Card.Description>We’d love to hear your thoughts about SUSe!</Card.Description>
					</Card.Header>

					<Card.Content class="flex flex-col gap-4 space-y-2">
						<div class="grid w-full gap-8">
							<Label for="bug-description"
								>How satisfied are you with the overall experience compared to the previous system?</Label
							>
							<EmojiButton />
						</div>

						<div class="grid w-full gap-1.5">
							<Label for="bug-steps">What improvements would you like to see with SUSê?</Label>
							<Textarea placeholder="Share your thoughts or suggestions for improvement." />
						</div>

						<div class="grid w-full gap-1.5">
							<Label for="bug-steps">Do you have any other comments to the developers?</Label>
							<Textarea placeholder="Feel free to provide any additional feedback or thoughts." />
						</div>
					</Card.Content>
					<Card.Footer>
						<Button class="max-w-[150px]">Send Bug Report</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
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
							<Label for="bug-description">What issue did you encounter?</Label>
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
						<Button class="max-w-[150px]">Send Bug Report</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</ScrollArea>
