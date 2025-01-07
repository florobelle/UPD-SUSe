import { allColleges, allPrograms } from '$lib/stores/CollegeProgramStore';
import { userTypes } from '$lib/stores/UserTypeStore';
import { z } from 'zod';

export const formSchema = z.object({
	first_name: z.string().min(2).max(50),
	middle_name: z.string().min(1).max(5),
	last_name: z.string().min(2).max(50),
	username: z.string().regex(/^[A-Za-z]+[0-9]*/, {
		message: 'Please enter your UP Mail'
	}),
	id: z.string().regex(/^\d{9}$/, {
		message: 'ID number must have exactly 9 digits'
	}),
	phone_number: z.string().regex(/^\d{10}$/, {
		message: 'Phone number must have exactly 10 digits'
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
