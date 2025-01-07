export type UserFilter = {
    lib_user_id: number,
    is_enrolled: boolean | null,
    is_active: boolean | null,
    college: string,
    unit: string,
    program: string,
    user_type: string
}

export type ServiceFilter = {
    service_type: string,
    in_use: boolean | null,
    library: string,
    section: string, 
}

export type UsageLogFilter = {
    start: Date | null,
    end: Date | null,
    lib_user_id: number,
    service_type: string,
    library: string,
    section: string, 
}