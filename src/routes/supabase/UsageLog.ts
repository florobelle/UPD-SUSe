import { supabaseClient } from "$lib/client/SupabaseClient";
import type { UsageLogFilter } from "$lib/dataTypes/EntityFilters";
import type { UsageLogResponse } from "$lib/dataTypes/EntityResponses";

export async function readUsageLog(filter:UsageLogFilter): Promise<UsageLogResponse> {
    // Reads and filters the service_engglib table in the database and returns all corresponding entries
    let query = supabaseClient.from(`public_service_${filter.library}`).select("*");

    if (filter.start != null) {
        query = query.gte('start', filter.start);
    }

    if (filter.end != null) {
        query = query.lte('end', filter.end);
    }

    if (filter.lib_user_id) {
        query = query.eq('lib_user_id', filter.lib_user_id);
    }

    if (filter.service_type) {
        query = query.eq('service_type', filter.service_type);
    }

    if (filter.library) {
        query = query.eq('library', filter.library);
    }

    if (filter.section) {
        query = query.eq('section', filter.section);
    }

    const { data, error } = await query;

    if (error) {
        return {
            usagelogs: null,
            error: `Error reading user_info table: ${error}`
        }
    }

    return {
        usagelogs: data,
        error: null
    }
}