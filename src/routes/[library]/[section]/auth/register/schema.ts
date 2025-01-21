import { allColleges, allPrograms } from '$lib/stores/CollegeProgramStore';
import { userTypes } from '$lib/stores/UserTypeStore';
import { z } from 'zod';

export const formSchema = z.object({
	first_name: z
		.string()
		.min(2)
		.max(50)
		.regex(
			/^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*(?:\s(?:II|III|IV|V|VI|VII|VIII|IX|X))?$/,
			'Start with a capital letter and the rest should be lowercase'
		),
	middle_name: z
		.string()
		.min(1)
		.max(5)
		.regex(/^[A-Z]+$/, 'Only capital letters'),
	last_name: z
		.string()
		.min(2)
		.max(50)
		.regex(
			/^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/,
			'Start with a capital letter and the rest should be lowercase'
		),
	username: z.string().regex(/^[a-z]+[0-9]*/, {
		message: 'Only lowercase letters (a-z) and numbers'
	}),
	id: z.string().regex(/^\d{9}$/, {
		message: 'Exactly 9 digits'
	}),
	phone_number: z.string().regex(/^\d{10}$/, {
		message: 'Exactly 10 digits'
	}),
	user_type: z.enum(userTypes.map((f) => f.value) as [string, ...string[]], {
		message: 'Please select a user type'
	}),
	college: z.enum(allColleges.map((g) => g.value) as [string, ...string[]], {
		message: 'Please select a college'
	}),
	program: z.enum(allPrograms.map((f) => f.value) as [string, ...string[]], {
		message: 'Please select a program'
	})
});

export type FormSchema = typeof formSchema;
