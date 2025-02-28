import { supabaseClient } from "$lib/client/SupabaseClient";
import type { UsageLogFilter } from "$lib/dataTypes/EntityFilters";
import type { UsageLogResponse } from "$lib/dataTypes/EntityResponses";

export async function readUsageLog(filter:UsageLogFilter): Promise<UsageLogResponse> {
    // Reads and filters the service_engglib table in the database and returns all corresponding entries
    let midnightToday: Date = new Date();
    midnightToday.setHours(0, 0, 0, 0);

    let query = supabaseClient
        .from(`public_usagelog_${filter.library}`)
        .select("*")
        .gte('start', midnightToday.toISOString())

    if (filter.usagelog_id) {
        query = query.eq('usagelog_id', filter.usagelog_id);
    }

    if (filter.start) {
        query = query.gte('start', filter.start);
    }

    if (filter.end) {
        query = query.lte('end', filter.end);
    }

    if (filter.is_active != null) {
        query = query.eq('is_active', filter.is_active);
    }

    if (filter.lib_user_id) {
        query = query.eq('lib_user_id', filter.lib_user_id);
    }

    if (filter.service_type) {
        query = query.eq('service_type', filter.service_type);
    }

    if (filter.section) {
        query = query.eq('section', filter.section);
    }

    const { data, error } = await query;

    if (error) {
        return {
            usagelogs: null,
            error: error.toString()
        }
    }

    return {
        usagelogs: data,
        error: null
    }
}

export async function updateUsageLog(usagelog:object, usageLogID: number): Promise<UsageLogResponse> {
    // Creates usage log in the usagelog_engglib table
    const { error } = await supabaseClient.from('usagelog_engglib').update(usagelog).eq('usagelog_id', usageLogID)

    if (error) {
        return {
            usagelogs: null,
            error: error.toString()
        }
    }

    return {
        usagelogs: null,
        error: null,
    };
}

export async function deleteUsageLog(usagelog_id:number): Promise<UsageLogResponse> {
    // Deletes usagelog record from usagelog_engglib table
    const { error } = await supabaseClient.from('usagelog_engglib').delete().eq('usagelog_id', usagelog_id)

    if (error) {
        return {
            usagelogs: null,
            error: error.toString()
        }
    }

    return {
        usagelogs: null,
        error: null,
    };
}