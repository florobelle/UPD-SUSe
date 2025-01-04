import { supabaseClient } from "$lib/client/SupabaseClient";
import type { UserFilter } from "$lib/dataTypes/EntityFilters";
import type { UserResponse } from "$lib/dataTypes/EntityResponses";
import type { formData } from "$lib/stores/UserStore";
import toast from "svelte-5-french-toast";

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
            error: `Error reading public_user_info table: ${error}`
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
            users: null,
            error: `Error reading user_info table: ${error}`
        }
    }

    return {
        users: data,
        error: null
    }
}

export async function createUser(userInfo:formData): Promise<UserResponse> {
    // Creates user information in the lib_user table.

    const { error } = await supabaseClient.from('lib_user').insert({
        id: userInfo.IDNum,
        username: userInfo.userName,
        rfid: userInfo.rfid,
        first_name: userInfo.firstName,
        middle_initial: userInfo.middleName,
        last_name: userInfo.lastName,
        phone_number: userInfo.phoneNum,
        is_enrolled: false,
        is_active: false,
        user_type_id: parseInt(userInfo.userType),
        program_id: parseInt(userInfo.program),
        college_id: parseInt(userInfo.college),
    })

    if (error) {
        return {
            users: null,
            error: `Error with creating user ${userInfo.userName}: ${error}`
        }
    }

    return {
        users: null,
        error: null,
    };
}

export async function updateUser(userInfo: object, username: string): Promise<UserResponse> {
    // Updates user information in the lib_user table
    // let toUpdate: Object = {};

    // if (userInfo.userName) {
    //     toUpdate = {...toUpdate, username: userInfo.userName}
    // }
    
    // if (userInfo.firstName) {
    //     toUpdate = {...toUpdate, first_name: userInfo.firstName}
    // }

    // if (userInfo.rfid) {
    //     toUpdate = {...toUpdate, rfid: userInfo.rfid}
    // }

    // if (userInfo.middleName) {
    //     toUpdate = {...toUpdate, middle_name: userInfo.middleName}
    // }

    // if (userInfo.lastName) {
    //     toUpdate = {...toUpdate, last_name: userInfo.lastName}
    // }

    // if (userInfo.phoneNum) {
    //     toUpdate = {...toUpdate, phone_number: userInfo.phoneNum}
    // }

    // if (userInfo.userType) {
    //     toUpdate = {...toUpdate, user_type_id: parseInt(userInfo.userType)}
    // }

    // if (userInfo.college_unit) {
    //     toUpdate = {...toUpdate, college_unit_id: userInfo.college_unit}
    // }

    // if (userInfo.program) {
    //     toUpdate = {...toUpdate, program_id: parseInt(userInfo.program)}
    // }
    
    const { error } = await supabaseClient.from('lib_user').update(userInfo).eq('username', username)

    if (error) {
        return {
            users: null,
            error: `Error with updating user ${username}: ${error}`
        }
    }

    return {
        users: null,
        error: null,
    };
}