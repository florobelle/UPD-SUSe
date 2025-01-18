import type { ServiceView, ServiceTypeTable } from "$lib/dataTypes/EntityTypes";
import { writable, type Writable } from "svelte/store";

type ServiceInformation = {
    serviceTypes: Array<ServiceTypeTable>,
    serviceCards: {[key: string]: ServiceCard},
    serviceOptions: {[key: string]: Array<ServiceOption>},
}

type ServiceCard = {
    service_type: string,
    service_type_id: number,
    available_number: number,
    service_img_src: string,
}

type ServiceOption = {
    type: string;
    label: string;
    options: ServiceView[];
    variant: 'default' | 'ghost';
}

export const ServiceStore: Writable<ServiceInformation> = writable()

export const ServiceTableStore: Writable<Array<ServiceView>> = writable();