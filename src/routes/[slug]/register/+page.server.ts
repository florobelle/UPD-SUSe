import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema.js';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions = {
    default: async ({ request }) => {
        // Sends an OTP to user's UP Mail
        const form = await superValidate(request, zod(formSchema));
        if (!form.valid) return fail(400, { form });
    }
}