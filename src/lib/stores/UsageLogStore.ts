import type { UsageLogView } from "$lib/dataTypes/EntityTypes"
import { writable, type Writable } from "svelte/store"

type ActiveUsagelog = {
    activeUsageLogs: Array<UsageLogView>,
}

export const ActiveUsageLogStore: Writable<ActiveUsagelog> = writable({
    activeUsageLogs: []
})