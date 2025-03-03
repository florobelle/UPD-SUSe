import { allColleges, allPrograms } from '$lib/stores/CollegeProgramStore';
import { UserTypeStore } from '$lib/stores/UserTypeStore';
import { z } from 'zod';

export const formSchema = z.object({
	first_name: z
		.string()
		.min(2)
		.max(50)
		.regex(
			/^[A-ZÑ][a-zñ]*(?:[-'\s][A-ZÑ][a-zñ]*)*(?:\s(?:II|III|IV|V|VI|VII|VIII|IX|X))?$/,
			'Please use sentence case letters only'
		),
	middle_name: z
		.string()
		.min(0)
		.max(5)
		.regex(/^[A-ZÑ]*$/, 'Capital letters only'),
	last_name: z
		.string()
		.min(2)
		.max(50)
		.regex(
			/^[A-ZÑ][a-zñ]*(?:\s[A-ZÑ][a-zñ]*)*$/,
			'Please use sentence case'
		),
	username: z.string().regex(/^[a-z]+[0-9]*/, {
		message: 'Lowercase letters (a-z) and numbers only'
	}),
	id: z.string().regex(/^\d{9}$/, {
		message: 'Exactly 9 digits'
	}),
	phone_number: z.string().regex(/^\d{10}$/, {
		message: 'Exactly 10 digits'
	}),
	user_type: z.enum(UserTypeStore.map((f) => f.value) as [string, ...string[]], {
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
