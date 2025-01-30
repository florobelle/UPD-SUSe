<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { cn } from '$lib/utilsFront.js';
	import { CalendarIcon } from 'lucide-svelte';
	import { parseDate, CalendarDateTime, CalendarDate } from '@internationalized/date';
	import { format } from 'date-fns';

	export let date: string;
	export let onChange: (value: Date) => void = () => {};

	let value;
	let calendarDate: CalendarDate;
	let formattedDate: string;
	let calendarDateTime: CalendarDateTime;

    $: {
        value = new Date(date);
        calendarDate = parseDate(value.toLocaleDateString('en-CA'));
        formattedDate = format(date, 'MM/dd/yyyy h:mm aa');
        calendarDateTime = new CalendarDateTime(
            calendarDate.year,
            calendarDate.month,
            calendarDate.day,
            value.getHours(),
            value.getMinutes()
        );
    }

	$: {
		if (calendarDateTime) {
			const parsedDate = new Date(
				calendarDateTime.year,
				calendarDateTime.month - 1,
				calendarDateTime.day,
				calendarDateTime.hour,
				calendarDateTime.minute
			);
			formattedDate = format(parsedDate, 'MM/dd/yyyy h:mm aa');

			// call the onChange function in data-table-editable-cell
			onChange(parsedDate);
		}
	}

	function handleDateSelect(selectedDate: CalendarDateTime | undefined) {
		// This funciton handles the changes in selected date in the calendar component

		if (selectedDate) {
			// If there's time already, keep the time
			if (calendarDateTime && 'hour' in calendarDateTime) {
				const existingTime = calendarDateTime as CalendarDateTime;
				calendarDateTime = selectedDate.set({
					hour: existingTime.hour,
					minute: existingTime.minute
				});
			}

			// Default midnight if no time exists
			else {
				calendarDateTime = (selectedDate as CalendarDateTime).set({
					hour: 0,
					minute: 0
				});
			}
		}
	}

	const hours = Array.from({ length: 12 }, (_, i) => i + 1);
	const minutes = Array.from({ length: 59 }, (_, i) => i + 1);
	const ampm = ['AM', 'PM'];

	function handleHourChange(val: string) {
		// This function updates the hour value of the calendarDateTime
		const hour = parseInt(val);
		const isPM = calendarDateTime.hour >= 12;
		calendarDateTime = calendarDateTime.set({
			hour: (hour % 12) + (isPM ? 12 : 0)
		});
	}

	function handleMinuteChange(val: string) {
		// This function updates the minute value of the calendarDateTime
		calendarDateTime = calendarDateTime.set({
			minute: parseInt(val)
		});
	}

	function handleAMPMChange(val: string) {
		// This function updates whether or not the time selected is in AM or PM
		const currentHour = calendarDateTime.hour;
		const isPM = currentHour >= 12;
		const newIsPM = val === 'PM';

		if (isPM !== newIsPM) {
			calendarDateTime = calendarDateTime.set({
				hour: currentHour + (newIsPM ? 12 : -12)
			});
		}
	}
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'flex flex-row justify-between gap-2 p-2 text-left font-normal',
				!date && 'text-muted-foreground'
			)}
			builders={[builder]}
            on:click={() => {date = date ? date : new Date().toLocaleString()}}
		>
			{date ? formattedDate : 'Pick a date'}
			<CalendarIcon class="ml-auto h-4 w-4" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<div class="sm:flex">
			<Calendar
				bind:value={calendarDateTime}
				on:keydown={() => handleDateSelect}
				class="rounded-md"
			/>

			<div class="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
				<ScrollArea.Root class="w-64 sm:w-auto">
					<div class="flex p-2 sm:flex-col">
						{#each hours.reverse() as hour (hour)}
							<Button
								size="icon"
								variant={calendarDateTime &&
								'hour' in calendarDateTime &&
								(calendarDateTime.hour % 12 || 12) === hour
									? 'default'
									: 'ghost'}
								class="aspect-square shrink-0 sm:w-full"
								on:click={() => handleHourChange(hour.toString())}
							>
								{hour}
							</Button>
						{/each}
					</div>
				</ScrollArea.Root>
				<ScrollArea.Root class="w-64 sm:w-auto">
					<div class="flex p-2 sm:flex-col">
						{#each minutes as minute (minute)}
							<Button
								size="icon"
								variant={calendarDateTime &&
								'minute' in calendarDateTime &&
								calendarDateTime.minute === minute
									? 'default'
									: 'ghost'}
								class="aspect-square shrink-0 sm:w-full"
								on:click={() => handleMinuteChange(minute.toString())}
							>
								{minute}
							</Button>
						{/each}
					</div>
				</ScrollArea.Root>
				<ScrollArea.Root>
					<div class="flex p-2 sm:flex-col">
						{#each ampm as period (period)}
							<Button
								size="icon"
								variant={calendarDateTime &&
								'hour' in calendarDateTime &&
								((period === 'AM' && calendarDateTime.hour < 12) ||
									(period === 'PM' && calendarDateTime.hour >= 12))
									? 'default'
									: 'ghost'}
								class="aspect-square shrink-0 sm:w-full"
								on:click={() => handleAMPMChange(period)}
							>
								{period}
							</Button>
						{/each}
					</div>
				</ScrollArea.Root>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
