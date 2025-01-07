export type User = {
    lib_user_id: number,
    rfid: number | null,
    username: string,
    first_name: string,
    middle_initial: string | null,
    last_name: string,
    phone_number: string,
    is_enrolled: boolean,
    is_active: boolean,
    college: string,
    unit: string,
    program: string | null,
    user_type: string
}

export type Admin = {
    admin_id: number,
    rfid: string,
    nickname: string,
    email: string,
    is_active: boolean,
    library: string,
    section: string,
}
export type Service = {
    service_id: number,
    service_type: string,
    service: string,
    in_use: boolean,
    library: string,
    section: string, 
}

export type ServiceType = {
    service_type_id: number,
    service_type: string
}

export type UsageLog = {
    usagelog_id: number,
    start: Date | null,
    end: Date | null,
    service_id: number,
    service: string,
    lib_user_id: number,
    first_name: string,
    last_name: string,
    service_type: string,
    section: string,
}