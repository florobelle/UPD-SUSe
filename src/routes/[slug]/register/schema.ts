import { z } from 'zod';
import { allPrograms, allColleges } from '$lib/stores/collegePrograms';
import { userTypes } from '$lib/stores/userTypes';

export const formSchema = z.object({
	firstName: z.string().min(2).max(50),
	middleName: z.string().min(1).max(5),
	lastName: z.string().min(2).max(50),
	userName: z.string().min(2).max(50),
	IDNum: z.string().regex(/^\d{9}$/, {
		message: 'ID number must have exactly 9 digits'
	}),
	phoneNum: z.string().regex(/^\d{11}$/, {
		message: 'Phone number must have exactly 11 digits'
	}),
	userType: z.enum(userTypes.map((f) => f.value) as [string, ...string[]], {
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