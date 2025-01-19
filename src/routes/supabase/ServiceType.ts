import { supabaseClient } from "$lib/client/SupabaseClient";
import type { ServiceTypeResponse } from "$lib/dataTypes/EntityResponses";

export async function readServiceType(): Promise<ServiceTypeResponse> {
    // Reads and filters the service_engglib table in the database and returns all corresponding entries
    const { data, error } = await supabaseClient.from(`service_type_engglib`).select("*").order('service_type_id', { ascending: true });

    if (error) {
        return {
            serviceTypes: null,
            error: error.toString()
        }
    }

    return {
        serviceTypes: data,
        error: null
    }
}