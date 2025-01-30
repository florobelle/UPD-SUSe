import { supabaseClient } from "$lib/client/SupabaseClient";
import type { ServiceFilter } from "$lib/dataTypes/EntityFilters";
import type { ServiceResponse } from "$lib/dataTypes/EntityResponses";

export async function readService(filter:ServiceFilter): Promise<ServiceResponse> {
    // Reads and filters the service_engglib table in the database and returns all corresponding entries
    let query = supabaseClient.from(`public_service_${filter.library}`).select("*").order('service_id', { ascending: true });

    if (filter.service_id) {
        query = query.eq('service_id', filter.service_id);
    }

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
            error: error.toString()
        }
    }

    return {
        services: data,
        error: null
    }
}

export async function updateService(service:object, serviceID: number): Promise<ServiceResponse> {
    // Creates usage log in the usagelog_engglib table
    const { error } = await supabaseClient.from('service_engglib').update(service).eq('service_id', serviceID)

    if (error) {
        return {
            services: null,
            error: error.toString()
        }
    }

    return {
        services: null,
        error: null,
    };
}