import toast from "svelte-5-french-toast";
import { supabaseClient } from "$lib/client/SupabaseClient";
import { createUser, updateUser } from "./User";
import type { formData } from "$lib/stores/UserStore";

export async function loginRfid(rfid: string, username: string): Promise<boolean> {
    // Logs in using user RFID and email from the database	
    if (username) {
        const { error } = await supabaseClient.auth.signInWithPassword({
            email: `${username}@up.edu.ph`,
            password: rfid
        });

        if (error) {
            toast.error(`Error with logging in with RFID: ${error}`);
            return false;
        }
    }

    return true;
}

export async function sendOtp(username: string): Promise<boolean> {
    // Logs in using user email with OTP

    if (username) {
        const { error } = await supabaseClient.auth.signInWithOtp({
            email: `${username}@up.edu.ph`,
        });
    
        if (error) {
            toast.error(`Error with sending OTP: ${error}`);
            return false;
        }
    }     
    
    return true;
}

export async function loginOtp(otp: string, username: string, toRegister: boolean, formData: formData): Promise<boolean> {
    // Logs in using user email with OTP
    const { data, error } = await supabaseClient.auth.verifyOtp({
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

export async function linkRfid(rfid: string, username: string) {
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