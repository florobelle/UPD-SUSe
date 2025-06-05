import { supabaseClient } from "$lib/client/SupabaseClient";
import type { UsageLogFilter } from "$lib/dataTypes/EntityFilters";
import type { UsageLogResponse } from "$lib/dataTypes/EntityResponses";

export async function readUsageLog(filter: UsageLogFilter): Promise<UsageLogResponse> {
    // Reads and filters the service_engglib table in the database and returns all corresponding entries
    let midnight3DaysAgo: Date = new Date();
    midnight3DaysAgo.setHours(0, 0, 0, 0);
    midnight3DaysAgo.setDate(midnight3DaysAgo.getDate() - 4)


    let query = supabaseClient
        .from(`public_usagelog_${filter.library}`)
        .select("*")
        .order('usagelog_id', { ascending: true })

    if (filter.usagelog_id) {
        query = query.eq('usagelog_id', filter.usagelog_id);
    }

    if (filter.start) {
        query = query.gte('start', filter.start);
    }

    if (filter.end) {
        query = query.lte('end', filter.end);
    }

    if (!filter.start && !filter.end) {
        query = query.or(`start.gte.${midnight3DaysAgo.toISOString()},is_active.is.true`);
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
            error: error.message
        }
    }

    return {
        usagelogs: data,
        error: null
    }
}

export async function updateUsageLog(usagelog: object, usageLogID: number): Promise<UsageLogResponse> {
    // Creates usage log in the usagelog_engglib table
    const { error } = await supabaseClient.from('usagelog_engglib').update(usagelog).eq('usagelog_id', usageLogID)

    if (error) {
        return {
            usagelogs: null,
            error: error.message
        }
    }

    return {
        usagelogs: null,
        error: null,
    };
}

export async function deleteUsageLog(usagelog_id: number): Promise<UsageLogResponse> {
    // Deletes usagelog record from usagelog_engglib table
    const { error } = await supabaseClient.from('usagelog_engglib').delete().eq('usagelog_id', usagelog_id)

    if (error) {
        return {
            usagelogs: null,
            error: error.message
        }
    }

    return {
        usagelogs: null,
        error: null,
    };
}

export async function countTotalService(filter: UsageLogFilter): Promise<{ count: number, error: string | null }> {
    // Counts each service for a specific admin and range of date
    let query = supabaseClient
        .from(`public_usagelog_${filter.library}`)
        .select('*', { count: 'exact', head: true })
        .or(`service_type.eq.${filter.service_type},main_service_type.eq.${filter.service_type}`)
        console.log(filter)

    if (filter.admin_nickname) {
        query = query.or(`admin_nickname1.eq.${filter.admin_nickname},admin_nickname2.eq.${filter.admin_nickname}`)
    }

    if (filter.section) {
        query = query.eq('section', filter.section)
    }

    if (filter.start) {
        query = query.gte('start', `${filter.start.getUTCFullYear()}-${filter.start.getUTCMonth()+1}-${filter.start.getUTCDate()} ${filter.start.getUTCHours()}:${filter.start.getUTCMinutes()}`);
    }

    if (filter.end) {
        query = query.lte('end', `${filter.end.getUTCFullYear()}-${filter.end.getUTCMonth()+1}-${filter.end.getUTCDate()} ${filter.end.getUTCHours()}:${filter.end.getUTCMinutes()}`);
    }
    const { count, error } = await query;

    if (error) {
        return {
            count: 0,
            error: error.message
        }
    }

    return { count: count != null ? count : 0, error: null }
}