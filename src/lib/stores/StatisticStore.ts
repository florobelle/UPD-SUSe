import { writable, type Writable } from "svelte/store";

type StatisticStore = {
    total_usagelogs: number,
    total_services: Array<{ [key: string]: string | number }>,
}

export const StatisticStore: Writable<StatisticStore> = writable({
    total_usagelogs: 0,
    total_services: []
})