import type { UsageLogView } from "$lib/dataTypes/EntityTypes"
import { writable, type Writable } from "svelte/store"

export const ActiveUsageLogStore: Writable<Array<UsageLogView>> = writable([])