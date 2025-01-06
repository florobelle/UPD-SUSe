import toast from "svelte-5-french-toast";
import { supabaseClient } from "$lib/client/SupabaseClient";
import { createUser, updateUser } from "./User";
import type { UserFormData } from "$lib/stores/UserStore";
import { createAdmin } from "./Admin";
import type { AdminFormData } from "$lib/stores/AdminStore";

// ----------------------------------------------------------------------------
// USER LOGIN
// ----------------------------------------------------------------------------

export async function loginRfid(rfid:string, username:string): Promise<boolean> {
    // Logs in using user RFID and email from the database	
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: `${username}@up.edu.ph`,
        password: rfid
    });

    if (error) {
        toast.error(`Error with logging in with RFID: ${error}`);
        return false;
    }

    return true;
}

export async function sendOtp(username:string): Promise<boolean> {
    // Sends OTP to user UP Mail
    const { error } = await supabaseClient.auth.signInWithOtp({
        email: `${username}@up.edu.ph`,
    });

    if (error) {
        toast.error(`Error with sending OTP: ${error}`);
        return false;
    }   
    
    return true;
}

export async function loginOtp(otp:string, username:string, toRegister:boolean, formData:UserFormData): Promise<boolean> {
    // Logs in using user email with OTP
    const { error } = await supabaseClient.auth.verifyOtp({
        email: `${username}@up.edu.ph`,
        token: otp,
        type: 'email'
    });

    if (error) {
        toast.error(`Error with verifying OTP: ${error}`);
        return false;
    }

    if (toRegister) {
        const { error } = await createUser(formData);

        if (error) {
            toast.error(`Error with creating a new user: ${error}`)
            return false;
        }
        if (formData.rfid) {
            linkRfid(formData.rfid, username);
        }
    }

    return true;
}

export async function linkRfid(rfid:string, username:string): Promise<boolean> {
    // Links the UP RFID of a student to their UP Mail account
    const { error } = await supabaseClient.auth.updateUser({ password: rfid})
    updateUser({ rfid }, username);

    if (error) {
        toast.error(`Error with linking RFID: ${error}`);
        return false;
    }
    toast.success('Successfull RFID linking!');
    return true;
}

// ----------------------------------------------------------------------------
// ADMIN LOGIN
// ----------------------------------------------------------------------------

export async function signUpAdmin(email:string): Promise<boolean> {
    // Sends OTP to admin email
    const { error } = await supabaseClient.auth.signInWithOtp({
        email: email,
    });

    if (error) {
        toast.error(`Error with sending OTP: ${error}`);
        return false;
    }   
    
    return true;
}

export async function verifyAdmin(otp:string, email:string, adminData:AdminFormData): Promise<boolean> {
    // Logs in using admin email with OTP
    const { error } = await supabaseClient.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
    });

    if (error) {
        toast.error(`Error with verifying OTP: ${error}`);
        return false;
    } else {
        const { error } = await createAdmin(adminData);

        if (error) {
            toast.error(`Error with creating a new admin: ${error}`)
            return false;
        } else {
            const { error } = await supabaseClient.auth.updateUser({ password: adminData.rfid})

            if (error) {
                toast.error(`Error with linking RFID: ${error}`);
                return false;
            }
            toast.success('Successfull admin creation!');
        }      
    }

    return true;
}

export async function loginAdmin(rfid:string, email:string): Promise<boolean> {
    // Lgs in using admin RFID and email from the database
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: rfid
    });

    if (error) {
        toast.error(`Error with logging in with RFID: ${error}`);
        return false;
    }

    return true;
}