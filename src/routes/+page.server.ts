import { supabaseServer } from '$lib/server/SupabaseClient'
import { redirect } from '@sveltejs/kit'

export const actions = {
    default: async () => { // Change action name to OAuth Login
        const { data, error } = await supabaseServer.auth.signInWithOAuth({
            provider: 'google',
            // Enable when there is a redirect page after logging in.
            options: {
                redirectTo: 'http://localhost:8080'
            }
        })

        if (data.url) {
            redirect(303, data.url) // use the redirect API for your server framework
        } else {
            console.log("Error with Google OAuth Login: " + error)
        }
    }
}