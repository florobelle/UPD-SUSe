import { supabaseClient } from "$lib/client/SupabaseClient";
import type { AdminResponse } from "$lib/dataTypes/EntityResponses";
import type { AdminFormData } from "$lib/stores/AdminStore";

type Email = { 
    email: string, 
    error: string | null 
}

export async function readEmail(rfid:string): Promise<Email> {
    // Reads the public_admin_info view in the database and returns the email of the admin
        let query = supabaseClient.from('public_admin_info').select("email");
    
        if (rfid) {
            query = query.eq('rfid', rfid);
        }
    
        const { data, error } = await query;
    
        if (error) {
            return {
                email: '',
                error: `Error reading admin email: ${error}`
            }
        }
    
        return {
            email: data.length ? data[0].email : '',
            error: null
        }
}

export async function createAdmin(adminData:AdminFormData): Promise<AdminResponse> {
    // Creates admin information in the admin_engglib table.

    const { error } = await supabaseClient.from('admin_engglib').insert(adminData)

    if (error) {
        return {
            admins: null,
            error: `Error with creating user ${adminData.nickname}: ${error}`
        }
    }

    return {
        admins: null,
        error: null,
    };
}