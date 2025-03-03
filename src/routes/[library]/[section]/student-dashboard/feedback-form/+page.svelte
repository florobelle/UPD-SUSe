<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import EmojiButton from '$lib/components/ui/emoji-button/emoji-button.svelte';
	import LikertButton from '$lib/components/ui/likert-button/likert-button.svelte';

	const answers: {[key:string]: string} = {
        q1_1_1: '',
        q1_1_2: '',
        q1_1_3: '',
        q1_1_4: '',
        
        q1_2_1: '',
        q1_2_2: '',

        q2_1: '',
        q2_2: '',
        q2_3: '',
        q2_4: '',
        
        q3_1_1: '',
        q3_1_2: '',
        q3_1_3: '',
        q3_1_4: '',
        q3_1_5: '',    
        
        q3_2_1: '',
        q3_2_2: '',
        q3_2_3: '',
        
        q4_1: '',
        q4_2: '',
        q4_3: '',

        q5_1: '',
        q5_2: '',
    }

    const questions: {[key:string]: string} = {
        q1_1_1: 'SUSê has a simple but modern layout and design.',
        q1_1_2: 'SUSê has a pleasant color palette.',
        q1_1_3: 'SUSê has the necessary content displayed to explain its functions.',
        q1_1_4: 'Overall, SUSê has an consistent and easy-to-read content.',
        
        q1_2_1: 'SUSê is easy to navigate.',
        q1_2_2: 'SUSê has clear labels on buttons and links.',

        q2_1: 'SUSê is a needed upgrade in Engineering Libraries services.',
        q2_2: 'SUSê should be available in other sections of the Engineering Libraries/other libraries in UP.',
        q2_3: 'SUSê is a unique software that gives more use to my UP ID.',
        q2_4: 'SUSê is unlike other applications used in UP libraries, making it a novel feature in Engineering Libraries.',
        
        q3_1_1: 'Logging in using my RFID is faster and easier than manually answering previous Google Registration Forms.',
        q3_1_2: 'SUSê v2 has better design and functionality than SUSê v1.',
        q3_1_3: 'SUSê v2 is faster and easier to use than SUSê v1.',
        q3_1_4: 'SUSê v1 captured the basic features for registration and availing a miscellaneous service but SUSê v2 improved these features.',
        q3_1_5: 'SUSê still has room for improvement.',    
        
        q3_2_1: 'SUSê improved my experience with availing miscellaneous in the Engineering Libraries.',
        q3_2_2: 'SUSê adds more utility to my UP ID.',
        q3_2_3: 'I would prefer to use SUSê from now on when availing services in the Engineering Libraries.',
        
        q4_1: 'SUSê has clear contrast between text and background, making it easier to read the content.',
        q4_2: 'SUSê can be used easily with a keyboard only.',
        q4_3: 'SUSê can be used with a screen reader and has alternative text to images.',
    }

    function submitFeedbackForm() {
        console.log(answers)
    }

    // function submitBugReport() {
    //     console.log(surveyAns)
    // }
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
				<Tabs.Trigger value="feedback">Survey</Tabs.Trigger>
				<Tabs.Trigger value="bug-report">Bug Report</Tabs.Trigger>
			</Tabs.List>
			<!-- Feedback Form -->
			<Tabs.Content value="feedback">
				<Card.Root>
					<Card.Header>
						<Card.Title>Survey</Card.Title>
						<Card.Description>Zarah Floro and Nina Sapitula are conducting a survey on the factors affecting the success of a website. 
                            Please indicate your agreement with the following statements to complete the survey. 
                            Your answers would greatly contribute to their research!</Card.Description>
					</Card.Header>

					<Card.Content class="flex flex-col gap-4 space-y-2">
                        {#each Object.keys(questions) as key}
                            <div class="grid w-full gap-8 pb-8">
                                <Label for="feedback" class="text-base">{questions[key]}</Label>
                                <LikertButton bind:answer={answers[key]} questionName={key}/>
                            </div>
                        {/each}

						<div class="grid w-full gap-8">
							<Label for="feedback" class="text-base">How satisfied are you with SUSê overall?</Label>
							<EmojiButton bind:rating={answers.q5_1} />
						</div>

                        <div class="grid w-full gap-1.5">
							<Label for="feedback" class="text-base">Is there anything you would like to tell the developers about SUSê?</Label>
							<Textarea
								placeholder="Your response may be a feature request or words of encouragement."
                                bind:value={answers.q5_2}
							/>
						</div>

                        <div>
                            <p class="text-muted-foreground">What you think of SUSê encourages us developers, researchers, and students to do our best 
                            and provide quality service to you 🫵, the students, librarians, faculty, and other library users of the Engineering Libraries.
                            We are very happy of SUSê's journey and we are glad you are part of it. Thank you 🧡!</p>
                        </div>
					</Card.Content>

					<Card.Footer>
						<Button class="max-w-[150px]" on:click={submitFeedbackForm}>Submit Survey</Button>
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
						<!-- <Button class="max-w-[150px]" on:click={submitBugReport}>Send Bug Report</Button> -->
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</ScrollArea>
