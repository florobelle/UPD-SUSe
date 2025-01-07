import type { Admin, Service, ServiceType, User } from "./EntityTypes"

export type UserResponse = {
    users: Array<User> | null
    error: string | null
}

export type AdminResponse = {
    admins: Array<Admin> | null
    error: string | null
}

export type ServiceResponse = {
    services: Array<Service> | null
    error: string | null
}

export type ServiceTypeResponse = {
    serviceTypes: Array<ServiceType> | null
    error: string | null
}