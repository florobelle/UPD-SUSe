import type { AdminTable, ServiceView, ServiceTypeTable, UsageLogView, UserView } from "./EntityTypes"

export type UserResponse = {
    users: Array<UserView> | null
    error: string | null
}

export type AdminResponse = {
    admins: Array<AdminTable> | null
    error: string | null
}

export type ServiceResponse = {
    services: Array<ServiceView> | null
    error: string | null
}

export type ServiceTypeResponse = {
    serviceTypes: Array<ServiceTypeTable> | null
    error: string | null
}

export type UsageLogResponse = {
    usagelogs: Array<UsageLogView> | null
    error: string | null
}

export type Error = { error: string | null}