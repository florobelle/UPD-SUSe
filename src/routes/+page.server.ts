import { supabase } from '$lib/server/SupabaseClient'
import { redirect } from '@sveltejs/kit'

export const actions = {
    default: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://upd-suse.vercel.app/auth/callback'
            }
        })

        if (data.url) {
            redirect(303, data.url) // use the redirect API for your server framework
        }
    }
}