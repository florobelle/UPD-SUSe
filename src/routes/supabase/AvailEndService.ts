import type { Error } from "$lib/dataTypes/EntityResponses";
import { supabaseClient } from "$lib/client/SupabaseClient";
import type { UsageLogDB } from "$lib/dataTypes/EntityTypes";
import { updateUser } from "./User";

export async function availService(serviceID:number, libUserID:number): Promise<{usagelog:UsageLogDB|null, error:string|null}> {
    // avails a service by creating a usage log, updating a service to in use, and updating the user to active
    const { data, error } = await supabaseClient.rpc('avail_service', { service: serviceID, lib_user: libUserID });

    if (error) {
        return { usagelog: null, error: error.toString() };
    }

    return { usagelog: data[0], error: null }
}

export async function endService(usagelog_id:number, service_id:number, username:string, is_user_active:boolean): Promise<Error> {
    // ends a service by updating the given usage log end datetime, updating the service to no in use, 
    // and updating the user to inactive if the user has no more active usagelogs 

    const { error } = await supabaseClient.rpc('end_service', { usagelog_id, service_id });
    if (error) {
        return { error: error.toString() };
    } else if (!is_user_active) {
        const { error } = await updateUser({ is_active: false }, username);

        if (error) {
            return { error }
        }
    }
    return {  error: null }
}