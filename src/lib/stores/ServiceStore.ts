import type { Service, ServiceType } from "$lib/dataTypes/EntityTypes";
import { writable, type Writable } from "svelte/store";

type ServiceInformation = {
    serviceTypes: Array<ServiceType>,
    services: Array<Service>
}

export const ServiceStore: Writable<ServiceInformation> = writable({
    serviceTypes: [],
    services: [],
})