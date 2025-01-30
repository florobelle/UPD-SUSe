import type { UsageLogView } from "$lib/dataTypes/EntityTypes"
import { writable, type Writable } from "svelte/store"

export const ActiveUsageLogStore: Writable<{ [key: string]: UsageLogView }> = writable();

export const UsageLogTableStore: Writable<Array<UsageLogView>> = writable([]);