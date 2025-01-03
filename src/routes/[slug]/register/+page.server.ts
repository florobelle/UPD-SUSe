import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { supabaseServer } from '$lib/server/SupabaseClient.js';

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
        
        const username: string = form.data.userName;
        console.log(username)
        const { data, error } = await supabaseServer.auth.signInWithOtp({
			email: `${username}@up.edu.ph`
		});

		if (error) {
			console.log(`Error with sending OTP: ${error}`);
		} else {
            console.log(data)
        }
        redirect(300, './verify-otp');
    }
}