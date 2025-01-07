import type { UsageLog } from "$lib/dataTypes/EntityTypes"
import { writable, type Writable } from "svelte/store"

type ActiveUsagelog = {
    activeUsageLogs: Array<UsageLog>,
}

export const ActiveUsageLogStore: Writable<ActiveUsagelog> = writable({
    activeUsageLogs: []
})