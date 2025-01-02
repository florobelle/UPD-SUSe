import { supabaseServer } from '$lib/server/SupabaseClient'
import { readUsername } from '$lib/server/User.js';
import { redirect } from '@sveltejs/kit'

export const actions = {
    rfidauth: async ({ request }) => {
        const formdata = await request.formData();
        const rfid: string = formdata.get('rfid') as string
        console.log(rfid)

        const { username, error } = await readUsername(rfid);
        console.log(username)

        if (username) {
            const { data, error } = await supabaseServer.auth.signInWithPassword({
                email: `${username}@up.edu.ph`,
                password: rfid
            })
            console.log(data)
    
            if (data.session) {
                redirect(303, '/');
            } else {
                console.log(`Error with RFID Login: ${error}`)
            }
        } else {
            console.log(`Error with reading username: ${error}`)
        }
    },
    googleauth: async () => { // Change action name to OAuth Login
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
            console.log(`Error with Google OAuth Login: ${error}`)
        }
    }
}