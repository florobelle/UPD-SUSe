import { supabaseClient } from "$lib/client/SupabaseClient";

export async function createFeedback(feedback: { [key: string]: string | number }): Promise<{ error: string }> {
    // creates a feedback in the feedback table

    const { error } = await supabaseClient.from('feedback').insert(feedback);

    if (error) {
        return {
            error: error.message
        }
    } else {
        return {
            error: ''
        }
    }
}

export async function createBugReport(bugReport: { [key: string]: string | number}): Promise<{ error: string }> {
    // creates a feedback in the feedback table

    const { error } = await supabaseClient.from('bug_report').insert(bugReport);

    if (error) {
        return {
            error: error.message
        }
    } else {
        return {
            error: ''
        }
    }
}