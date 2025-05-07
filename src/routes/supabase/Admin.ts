import { supabaseClient } from "$lib/client/SupabaseClient";
import type { AdminFilter } from "$lib/dataTypes/EntityFilters";
import type { AdminResponse } from "$lib/dataTypes/EntityResponses";
import type { AdminFormData } from "$lib/stores/AdminStore";

type Email = { 
    rfid: string,
    email: string, 
    error: string | null 
}

export async function readCredentials(rfid:string, email:string, library:string, section:string): Promise<Email> {
    // Reads the public_admin_info view in the database and returns the email of the admin
    let query = supabaseClient.from(`public_admin_${library}`).select("email, rfid").eq('section', section);

    if (rfid) {
        query = query.eq('rfid', rfid);
    }

    if (email) {
        query = query.eq('email', email);
    }

    const { data, error } = await query;

    if (error) {
        return {
            rfid: '',
            email: '',
            error: error.message
        }
    }

    return {
        rfid: data.length ? data[0].rfid : '',
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

    if (filter.admin_id) {
        query = query.eq('admin_id', filter.admin_id)
    }
    if (filter.is_active != null) {
        query = query.eq('is_active', filter.is_active)
    }
    if (filter.section) {
        query = query.eq('section', filter.section)
    }
    if (filter.is_approved != null) {
        query = query.eq('is_approved', filter.is_approved)
    }
    if (filter.email) {
        query = query.eq('email', filter.email)
    }

    const { data, error } = await query;

    if (error) {
        return {
            admins: null,
            error: error.message
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
            error: error.message
        }
    }

    return {
        admins: null,
        error: null,
    };
}

export async function updateAdmin(adminInfo:object, email:string, admin_id:number=0): Promise<AdminResponse> {
    // Updates user information in the admin_engglib table
    let query = supabaseClient.from('admin_engglib').update(adminInfo)

    if (email) {
        query = query.eq('email', email);
    } else {
        query = query.eq('admin_id', admin_id);
    }
    const { error } = await query;

    if (error) {
        return {
            admins: null,
            error: error.message
        }
    }

    return {
        admins: null,
        error: null,
    };
}

export async function deleteAdmin(admin_id:number): Promise<AdminResponse> {
    // Deletes admin record from admin_engglib table
    const { error } = await supabaseClient.from('admin_engglib').delete().eq('admin_id', admin_id)

    if (error) {
        return {
            admins: null,
            error: error.message
        }
    }

    return {
        admins: null,
        error: null,
    };
}