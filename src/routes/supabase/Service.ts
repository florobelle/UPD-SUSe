import { supabaseClient } from "$lib/client/SupabaseClient";
import type { ServiceFilter } from "$lib/dataTypes/EntityFilters";
import type { ServiceResponse } from "$lib/dataTypes/EntityResponses";

export async function readService(filter:ServiceFilter): Promise<ServiceResponse> {
    // Reads and filters the service_engglib table in the database and returns all corresponding entries
    let query = supabaseClient.from(`public_service_${filter.library}`).select("*");

    if (filter.in_use != null) {
        query = query.eq('in_use', filter.in_use);
    }

    if (filter.section) {
        query = query.eq('section', filter.section);
    }

    if (filter.service_type) {
        query = query.eq('service_type', filter.service_type);
    }

    const { data, error } = await query;

    if (error) {
        return {
            services: null,
            error: `Error reading user_info table: ${error}`
        }
    }

    return {
        services: data,
        error: null
    }
}