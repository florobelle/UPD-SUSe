import type { ServiceTypeTable, ServiceView } from "$lib/dataTypes/EntityTypes";
import { writable, type Writable } from "svelte/store";

export type ServiceInfo = {
    service_type: string,
    service_type_id: number,
    available_number: number,
    service_img_src: string,
}

export type ServiceOption = {
    type: string;
    label: string;
    options: ServiceView[];
    variant: 'default' | 'ghost';
}

export const ServiceTypeStore: Writable<Array<ServiceTypeTable>> = writable();
export const ServiceInfoStore: Writable<{ [key: string]: ServiceInfo }> = writable();
export const ServiceOptionStore: Writable<{ [key: string]: Array<ServiceOption> }> = writable();

export const ServiceTableStore: Writable<Array<ServiceView>> = writable();