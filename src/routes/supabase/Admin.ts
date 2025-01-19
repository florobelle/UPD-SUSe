import { supabaseClient } from "$lib/client/SupabaseClient";
import type { AdminFilter } from "$lib/dataTypes/EntityFilters";
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
                error: error.toString()
            }
        }
    
        return {
            email: data.length ? data[0].email : '',
            error: null
        }
}

export async function readAdmin(filter:AdminFilter): Promise<AdminResponse> {
    // reads the admin information in the admin_engglib
    let table:string = `admin_engglib`
    if (filter.library) {
        table = `public_admin_${filter.library}`;
    }
    
    let query = supabaseClient.from(table).select("*");

    if (filter.is_active != null) {
        query = query.eq('is_active', filter.is_active)
    }
    if (filter.section) {
        query = query.eq('section', filter.section)
    }
    if (filter.is_approved != null) {
        query = query.eq('is_approved', filter.is_approved)
    }

    const { data, error } = await query;

    if (error) {
        return {
            admins: null,
            error: error.toString()
        }
    }

    return {
        admins: data,
        error: null,
    };
}

export async function createAdmin(adminData:AdminFormData): Promise<AdminResponse> {
    // Creates admin information in the admin_engglib table.

    const { error } = await supabaseClient.from('admin_engglib').insert({
        rfid: adminData.rfid,
        nickname: adminData.nickname,
        email: adminData.email,
        is_active: false,
        is_approved: false,
        library_id: parseInt(adminData.library),
        section_id: parseInt(adminData.section),
    })

    if (error) {
        return {
            admins: null,
            error: error.toString()
        }
    }

    return {
        admins: null,
        error: null,
    };
}

export async function updateAdmin(adminInfo: object, email: string): Promise<AdminResponse> {
    // Updates user information in the lib_user table
    
    const { error } = await supabaseClient.from('lib_user').update(adminInfo).eq('email', email)

    if (error) {
        return {
            admins: null,
            error: error.toString()
        }
    }

    return {
        admins: null,
        error: null,
    };
}