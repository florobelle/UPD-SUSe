import { createCookie, deleteCookie, readCookie } from "$lib/client/Cookie";
import { supabaseClient } from "$lib/client/SupabaseClient";

async function addPCCookie(): Promise<{ newID: string, error: string }> {
    // Adds a unique ID for a PC
    const newID: string = Math.ceil(Math.random() * (10 ** 15)).toString();
    createCookie('pcCookie', newID, 24 * 30 * 4, '/')

    const { error } = await supabaseClient.from('cookie').insert({ cookie_id: newID })

    if (error) {
        return {
            newID: '',
            error: error.message
        }
    } else {
        return {
            newID,
            error: ''
        }
    }
}

export async function verifyPC(): Promise<{ error: string }> {
    // Verifies this PC is an EnggLib managed PC by checking the generated cookie
    let pcCookie: number = parseInt(readCookie('pcCookie'));
    if (!pcCookie) {
        pcCookie = parseInt((await addPCCookie()).newID);
    }
    const { data, error } = await supabaseClient
        .from('cookie')
        .select('is_approved')
        .eq('cookie_id', pcCookie)
    if (error) {
        return {
            error: error.message
        }
    }
    else if (data.length && !data[0].is_approved) {
        return {
            error: 'PC not approved to access SUSê.'
        }
    }
    else if (data.length == 0) {
        await addPCCookie();
    }
    return {
        error: ''
    }
}

export async function approvePC(cookieID: number): Promise<{ error: string }> {
    // Approves this PC
    const { error } = await supabaseClient.from('cookie').update({ is_approved: true }).eq('cookie_id', cookieID);

    if (error) {
        return {
            error: error.message
        }
    }

    return {
        error: ''
    }
}