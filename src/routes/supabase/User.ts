import { supabaseClient } from "$lib/client/SupabaseClient";
import type { UserFilter } from "$lib/dataTypes/EntityFilters";
import type { UserResponse } from "$lib/dataTypes/EntityResponses";
import type { UserFormData } from "$lib/stores/UserStore";

type Username = { 
    username: string, 
    error: string | null 
}

export async function readUsername(rfid:string='', username:string=''): Promise<Username> {
    // Reads the public_user_info view in the database and returns the username of the user
    let query = supabaseClient.from('public_user_info').select("username");

    if (rfid) {
        query = query.eq('rfid', rfid);
    } else if (username) {
        query = query.eq('username', username);
    }

    const { data, error } = await query;

    if (error) {
        return {
            username: '',
            error: error.toString()
        }
    }

    return {
        username: data.length ? data[0].username : '',
        error: null
    }
}

export async function readUser(filter:UserFilter): Promise<UserResponse> {
    // Reads and filters the user_info view in the database and returns all corresponding entries
    let query = supabaseClient.from('user_info').select("*");

    if (filter.lib_user_id) {
        query = query.eq('lib_user_id', filter.lib_user_id)
    }
    if (filter.username) {
        query = query.eq('username', filter.username)
    }
    if (filter.is_approved != null) {
        query = query.eq('is_approved', filter.is_approved)
    }
    if (filter.is_active != null) {
        query = query.eq('is_active', filter.is_active)
    }
    if (filter.college) {
        query = query.eq('college', filter.college)
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
            users: null,
            error: error.toString()
        }
    }

    return {
        users: data,
        error: null
    }
}

export async function createUser(userInfo:UserFormData): Promise<UserResponse> {
    // Creates user information in the lib_user table.

    const { error } = await supabaseClient.from('lib_user').insert({
        lib_user_id: userInfo.lib_user_id,
        username: userInfo.username,
        rfid: userInfo.rfid ? userInfo.rfid : null,
        first_name: userInfo.first_name,
        middle_initial: userInfo.middle_name ? userInfo.middle_name : null,
        last_name: userInfo.last_name,
        phone_number: userInfo.phone_number,
        is_approved: false,
        is_active: false,
        user_type_id: parseInt(userInfo.user_type),
        program_id: parseInt(userInfo.program),
        college_id: parseInt(userInfo.college),
    })

    if (error) {
        return {
            users: null,
            error: error.toString()
        }
    }

    return {
        users: null,
        error: null,
    };
}

export async function updateUser(userInfo: object, username: string, lib_user_id:number=0): Promise<UserResponse> {
    // Updates user information in the lib_user table
    let query = supabaseClient.from('lib_user').update(userInfo)

    if (username) {
        query = query.eq('username', username);
    } else {
        query = query.eq('lib_user_id', lib_user_id);
    }
    const { error } = await query

    if (error) {
        return {
            users: null,
            error: error.toString()
        }
    }

    return {
        users: null,
        error: null,
    };
}