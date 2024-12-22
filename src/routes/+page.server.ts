import { supabase } from '$lib/server/SupabaseClient'
import { redirect } from '@sveltejs/kit'

export const actions = {
    default: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'localhost:5173/auth/callback'
            }
        })

        if (data.url) {
            redirect(303, data.url) // use the redirect API for your server framework
        }
    }
}