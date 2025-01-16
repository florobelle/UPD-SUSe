import type { ServiceView, ServiceTypeTable } from "$lib/dataTypes/EntityTypes";
import { writable, type Writable } from "svelte/store";

type ServiceInformation = {
    serviceTypes: Array<ServiceTypeTable>,
    services: Array<ServiceView>
}

export const ServiceStore: Writable<ServiceInformation> = writable({
    serviceTypes: [],
    services: [],
})

export const ServiceTableStore: Writable<Array<ServiceView>> = writable();