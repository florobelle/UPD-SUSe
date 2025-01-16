import { z } from 'zod';

export const formSchema = z.object({
	nickname: z.string().min(2).max(50),
	email: z.string().min(1).max(50)
});

export type FormSchema = typeof formSchema;
