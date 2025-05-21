import { supabaseClient } from "$lib/client/SupabaseClient";
import { createUser, updateUser } from "./User";
import type { UserFormData } from "$lib/stores/UserStore";
import { createAdmin, readAdmin, updateAdmin } from "./Admin";
import type { AdminFormData } from "$lib/stores/AdminStore";
import type { Error } from "$lib/dataTypes/EntityResponses";

// ----------------------------------------------------------------------------
// USER LOGIN
// ----------------------------------------------------------------------------

export async function loginRfid(rfid: string, username: string): Promise<Error> {
    // Logs in using user RFID and email from the database	
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: `${username}@up.edu.ph`,
        password: rfid
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function sendOtp(username: string): Promise<Error> {
    // Sends OTP to user UP Mail
    const { error } = await supabaseClient.auth.signInWithOtp({
        email: `${username}@up.edu.ph`,
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function loginOtp(otp: string, username: string, toRegister: boolean, formData: UserFormData): Promise<Error> {
    // Logs in using user email with OTP
    const { error } = await supabaseClient.auth.verifyOtp({
        email: `${username}@up.edu.ph`,
        token: otp,
        type: 'email'
    });

    if (error) {
        return { error: error.message };
    }

    if (toRegister) {
        const { error } = await createUser(formData);

        if (error) {
            return { error };
        }
        if (formData.rfid) {
            const { error } = await linkRfid(formData.rfid, username);
            if (error) {
                return { error };
            }
        }
    }

    return { error: null };
}

export async function linkRfid(rfid: string, username: string): Promise<Error> {
    // Links the UP RFID of a student to their UP Mail account
    const { error } = await supabaseClient.auth.updateUser({ password: rfid })
    if (error) {
        return { error: error.message };
    } else {
        const { error } = await updateUser({ rfid }, username);
        if (error) {
            return { error };
        }
    }
    return { error: null };
}

// ----------------------------------------------------------------------------
// ADMIN LOGIN
// ----------------------------------------------------------------------------

export async function signUpAdmin(email: string): Promise<Error> {
    // Sends OTP to admin email
    const { error } = await supabaseClient.auth.signInWithOtp({
        email: email,
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function verifyAdmin(otp: string, email: string, toRegister: boolean, formData: AdminFormData): Promise<Error> {
    // Logs in using admin email with OTP
    const { error } = await supabaseClient.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
    });

    if (error) {
        return { error: error.message };
    } else if (toRegister) {
        const { error } = await createAdmin(formData);

        if (error) {
            return { error };
        } else {
            const { admins, error } = await readAdmin({
                admin_id: 0,
                email: email,
                is_active: null,
                is_approved: null,
                library: '',
                section: ''
            });

            if (error) {
                return { error };
            } else if (admins != null && admins[0].is_approved) {
                return { error: null };
            } else if (admins == null) {
                const { error } = await supabaseClient.auth.updateUser({ password: formData.rfid })

                if (error) {
                    return { error: error.message };
                }
            }
        }
    }

    return { error: null };
}

export async function loginAdmin(rfid: string, email: string): Promise<Error> {
    // Lgs in using admin RFID and email from the database
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: rfid
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function sendAdminOTP(email: string): Promise<Error> {
    // Sends OTP to user admin email
    const { error } = await supabaseClient.auth.signInWithOtp({
        email,
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function linkAdminRfid(rfid: string, email: string): Promise<Error> {
    // Links the UP RFID of a student to their UP Mail account
    const { error } = await supabaseClient.auth.updateUser({ password: rfid })
    if (error) {
        return { error: error.message };
    } else {
        const { error } = await updateAdmin({ rfid }, email);
        if (error) {
            return { error };
        }
    }
    return { error: null };
}