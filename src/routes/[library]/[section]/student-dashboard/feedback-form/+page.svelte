<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import EmojiButton from '$lib/components/ui/emoji-button/emoji-button.svelte';
	import LikertButton from '$lib/components/ui/likert-button/likert-button.svelte';
	import { createBugReport, createFeedback } from '../../../../supabase/Feedback';
	import toast from 'svelte-5-french-toast';
	import { goto } from '$app/navigation';
	import { UserStore } from '$lib/stores/UserStore';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	const surveyAnswers: { [key: string]: string } = {
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
		q5_2: ''
	};

	const surveyQuestions: Array<{
		category: string;
		questions: { [key: string]: string };
		completeQuestions: number;
	}> = [
		{
			category: 'User Interface & User Experience',
			questions: {
				q1_1_1: 'SUSê has a simple but modern layout and design.',
				q1_1_2: 'SUSê has a pleasant color palette.',
				q1_1_3: 'SUSê has enough content displayed to explain its functions.',
				q1_1_4: 'Overall, SUSê has consistent organization and easy-to-read content.',

				q1_2_1: 'SUSê is easy to navigate.',
				q1_2_2: 'SUSê has clear labels on buttons and links.'
			},
			completeQuestions: 0
		},
		{
			category: 'Novelty & Need',
			questions: {
				q2_1: 'SUSê is a needed upgrade in Engineering Libraries services.',
				q2_2: 'SUSê should be available in other sections of the Engineering Libraries. (SUSê is only available in EnggLib 1 Circulation and GFS, and EnggLib 2 Circulation)',
				q2_3: 'SUSê gives more utility to my UP ID.',
				q2_4: 'SUSê is a novelty in Engineering Libraries. (novelty: different, new, unusual)'
			},
			completeQuestions: 0
		},
		{
			category: 'End-User Satisfaction',
			questions: {
				q3_1_1:
					'Logging in using my UP ID is faster and easier than manually answering Google Registration Forms.',
				q3_1_2: 'SUSê v2 has better design and functionality than SUSê v1.',
				q3_1_3:
					'SUSê v2 is faster and easier to use than SUSê v1. (N/A if you did not use SUSê in 1st Sem 24-25)',
				q3_1_4:
					'SUSê v1 captured the basic features for registration and availing a miscellaneous service but SUSê v2 improved these features.  (N/A if you did not use SUSê in 1st Sem 24-25)',
				q3_1_5:
					'SUSê still has room for improvement. (N/A if you did not use SUSê in 1st Sem 24-25)',

				q3_2_1:
					'SUSê improved my experience when availing miscellaneous in the Engineering Libraries.',
				q3_2_2: 'I still prefer using Google Forms when availing Engineering Library services.',
				q3_2_3:
					'I would prefer to use SUSê from now on when availing services in the Engineering Libraries.'
			},
			completeQuestions: 0
		},
		{
			category: 'Accessibility',
			questions: {
				q4_1: 'SUSê has clear contrast between text and background, making it easier to read the content.',
				q4_2: 'SUSê can be used easily with a keyboard only. (N/A if you use mouse and keyboard to interact with SUSê)',
				q4_3: 'SUSê can be used with a screen reader and has alternative text to images. (N/A if you do not use screen readers for SUSê)'
			},
			completeQuestions: 0
		}
	];

	const bugReportAnswers: { [key: string]: string } = {
		q1: '',
		q2: ''
	};

	let pageNum: number = 0;
    let completeAdditionalQuestions: number = 0;

	let surveyCompleteDialog: boolean = false;
    let bugReportCompleteDialog: boolean = false;
	let completeSurvey: boolean = true;
	let completeBugReport: boolean = true;

	async function submitFeedbackForm() {
		// stores library user answers to database
		for (const [key, value] of Object.entries(surveyAnswers)) {
			if (!value && key != 'q5_2') {
				completeSurvey = false;
				return;
			}
		}
		completeSurvey = true;
		let feedback = { ...surveyAnswers, lib_user_id: parseInt($UserStore.formData.lib_user_id) };

		const { error } = await createFeedback(feedback);

		if (error) {
			toast.error(`Error with submitting feedback: ${error}`);
		} else {
			surveyCompleteDialog = true;
		}
	}

	async function submitBugReport() {
		// stores library user answers to database
		for (const [key, value] of Object.entries(bugReportAnswers)) {
			if (!value) {
				completeBugReport = false;
				return;
			}
		}
		completeBugReport = true;
		let bugReport = { ...bugReportAnswers, lib_user_id: parseInt($UserStore.formData.lib_user_id) };

		const { error } = await createBugReport(bugReport);

		if (error) {
			toast.error(`Error with submitting bug report: ${error}`);
		} else {
			bugReportCompleteDialog = true;
		}
	}

	function nextPage() {
		// turns to the next page in the survey
		if (pageNum < surveyQuestions.length) {
			pageNum++;
			goto('./feedback-form#survey-title');
		}
	}

	function prevPage() {
		// turns to the next page in the survey
		if (pageNum > 0) {
			pageNum--;
			goto('./feedback-form#survey-title');
		}
	}

    function resetForms() {
        // Resets the feedback and bug report forms
        surveyCompleteDialog = false; 
        bugReportCompleteDialog = false;
        pageNum = 0;
        for (const key of Object.keys(surveyAnswers)) {
            surveyAnswers[key] = '';
        }

        for (const key of Object.keys(bugReportAnswers)) {
            bugReportAnswers[key] = '';
        }
    }
</script>

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
					<Card.Title id="survey-title">Survey</Card.Title>
					<Card.Description
						>Zarah Floro and Nina Sapitula WSL seniors conducting a survey on the factors affecting
						the success of a website. Please indicate your disagreement/agreement with the following
						statements to complete the survey. Your answers would greatly contribute to their
						research!</Card.Description
					>
				</Card.Header>

				<Card.Content class="flex flex-col">
					{#key pageNum}
						{#if pageNum < surveyQuestions.length}
							<h3 class="text-lg font-semibold">{surveyQuestions[pageNum].category}</h3>
							<div class="grid grid-cols-2 py-4">
								<!-- Questions -->
								<div class="flex flex-col gap-6">
									{#each Object.keys(surveyQuestions[pageNum].questions) as key, i}
										<div class="flex flex-col gap-1.5">
											<Label for="feedback" class="text-base"
												>{i + 1}. {surveyQuestions[pageNum].questions[key]}</Label
											>
											{#if !completeSurvey && !surveyAnswers[key] && key != 'q5_2'}
												<p class="text-sm text-destructive">
													Please respond to the statement/question above.
												</p>
											{/if}
											<LikertButton
												bind:answer={surveyAnswers[key]}
												on:change={(_) => surveyQuestions[pageNum].completeQuestions++}
												questionName={key}
											/>
										</div>
									{/each}
								</div>

								<!-- Sticky -->
								{#key surveyQuestions[pageNum].completeQuestions}
									<div class="sticky top-[30%] max-h-min place-items-center text-center">
										<p class="text-[50px] font-semibold">
											{surveyQuestions[pageNum].completeQuestions}/{Object.keys(
												surveyQuestions[pageNum].questions
											).length}
										</p>
										<p>Questions left in this section</p>
										{#if surveyQuestions[pageNum].completeQuestions == Object.keys(surveyQuestions[pageNum].questions).length}
											<p>You have completed this section! Here's an uiiau cat.</p>
											<img
												alt="Spinning cat GIF"
												src={'../../../misc/cat-spinning.gif'}
												class="size-32"
											/>
										{/if}
									</div>
								{/key}
							</div>
						{:else if pageNum == surveyQuestions.length}
                            <h3 class="text-lg font-semibold">Overall Feedback</h3>
                            <div class="grid grid-cols-2 py-4">
                                <!-- Additional Questions -->
                                <div class="flex flex-col gap-6">
                                    <div class="grid w-full gap-1.5">
                                        <Label for="feedback" class="text-base"
                                            >How satisfied are you with SUSê overall?</Label
                                        >
                                        {#if !completeSurvey && !surveyAnswers.q5_1}
                                            <p class="text-sm text-destructive">
                                                Please respond to the statement/question above.
                                            </p>
                                        {/if}
                                        <EmojiButton bind:rating={surveyAnswers.q5_1} on:change={(_) => completeAdditionalQuestions++}/>
                                    </div>
    
                                    <div class="grid w-full gap-1.5">
                                        <Label for="feedback" class="text-base"
                                            >Is there anything you would like to tell the developers about SUSê? (Optional)</Label
                                        >
                                        <Textarea
                                            placeholder="Your response may be a feature request or words of encouragement."
                                            bind:value={surveyAnswers.q5_2}
                                        />
                                    </div>
                                </div>

                                <!-- Sticky -->
                                {#key completeAdditionalQuestions}
									<div class="sticky top-[30%] max-h-min place-items-center text-center">
										<p class="text-[50px] font-semibold">
											{completeAdditionalQuestions}/1
										</p>
										<p>Questions left in this section</p>
										{#if completeAdditionalQuestions == 1}
											<p>You have completed this section! Here's an uiiau cat.</p>
											<img
												alt="Spinning cat GIF"
												src={'../../../misc/cat-spinning.gif'}
												class="size-32"
											/>
										{/if}
									</div>
								{/key}
                            </div>
						{/if}
					{/key}
				</Card.Content>

				<Card.Footer>
					<div class="flex items-center gap-2">
						<Button variant="outline" on:click={prevPage}><ChevronLeft /></Button>
						<p class="text-sm text-muted-foreground">
							Page {pageNum + 1} of {surveyQuestions.length + 1}
						</p>
						<Button variant="outline" on:click={nextPage}><ChevronRight /></Button>
						{#if pageNum == surveyQuestions.length}
							<Button class="max-w-[150px]" on:click={submitFeedbackForm}>Submit Survey</Button>
						{/if}
					</div>
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
						{#if !completeBugReport && !bugReportAnswers.q1}
							<p class="text-sm text-destructive">
								Please respond to the statement/question above.
							</p>
						{/if}
						<Textarea
							placeholder="Please be as decriptive as you can when describing the bug you encountered."
							bind:value={bugReportAnswers.q1}
						/>
					</div>

					<div class="grid w-full gap-1.5">
						<Label for="bug-steps">Can you describe the steps you took to cause the bug?</Label>
						{#if !completeBugReport && !bugReportAnswers.q2}
							<p class="text-sm text-destructive">
								Please respond to the statement/question above.
							</p>
						{/if}
						<Textarea
							placeholder="This will let the developers recreate the bug and find what's causing the issue faster!"
							bind:value={bugReportAnswers.q2}
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

<!-- Survey Dialog -->
<Dialog.Root bind:open={surveyCompleteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>You have completed the survey! 🎉</Dialog.Title>
			<Dialog.Description>
				<div class="place-items-center">
					<p>
						We are very happy of SUSê's journey and we
						are glad you are part of it. Thank you for taking the time to answer our survey! 🧡
					</p>

					<img alt="Cat jumping happily" src={'../../../misc/happy-cat.gif'} />
				</div>
			</Dialog.Description>
		</Dialog.Header>
        <Dialog.Footer>
            <Button variant="outline" on:click={resetForms}>Stay</Button>
            <Button on:click={_ => {goto('./services')}}>Back to Services</Button>
        </Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Bug Report Dialog -->
<Dialog.Root bind:open={bugReportCompleteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>You have completed the bug report! 🎉</Dialog.Title>
			<Dialog.Description>
				<div class="place-items-center">
					<p>
						Thank you for letting us know about the issues you've encountered. 
                        We'll fix this as soon as possible! 🧡
					</p>

					<img alt="Cat jumping happily" src={'../../../misc/happy-cat.gif'} />
				</div>
			</Dialog.Description>
		</Dialog.Header>
        <Dialog.Footer>
            <Button variant="outline" on:click={resetForms}>Stay</Button>
            <Button on:click={_ => {goto('./services')}}>Back to Services</Button>
        </Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>