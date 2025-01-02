import type { UserFilter } from "./EntityFilters";
import type { UserResponse } from "./EntityResponses";
import { supabaseServer } from "./SupabaseClient";

type Username = { 
    username: string, 
    error: string | null 
}

const success = {
    users: null,
    error: null
}

export async function readUsername(rfid: string): Promise<Username> {
    // Reads the public_user_info view in the database and returns the username of the user
    const { data, error } = await supabaseServer.from('public_user_info').select("username").eq('rfid', rfid);

    if (error) {
        return {
            username: '',
            error: `Error reading public_user_info table: ${error}`
        }
    }

    return {
        username: data.length ? data[0].username : '',
        error: null
    }
}

export async function readUserInfo(filter: UserFilter): Promise<UserResponse> {
    // Reads and filters the user_info view in the database and returns all corresponding entries
    let query = supabaseServer.from('user_info').select("*");

    if (filter.id) {
        query = query.eq('id', filter.id)
    }
    if (filter.is_enrolled != null) {
        query = query.eq('is_enrolled', filter.is_enrolled)
    }
    if (filter.is_active != null) {
        query = query.eq('is_active', filter.is_active)
    }
    if (filter.college) {
        query = query.eq('college', filter.college)
    }
    if (filter.unit) {
        query = query.eq('unit', filter.unit)
    }
    if (filter.program) {
        query = query.eq('program', filter.program)
    }
    if (filter.user_type) {
        query = query.eq('user_type', filter.user_type)
    }

    const { data, error } = await query;

    if (error) {
        return {
            users: [],
            error: `Error reading user_info table: ${error}`
        }
    }

    return {
        users: data,
        error: null
    }
}