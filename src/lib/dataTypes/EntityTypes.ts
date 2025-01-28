export type UserView = {
    lib_user_id: number,
    rfid: number | null,
    username: string,
    first_name: string,
    middle_initial: string | null,
    last_name: string,
    phone_number: string,
    is_approved: boolean,
    is_active: boolean,
    college: string,
    program: string | null,
    user_type: string
}

export type UserTable = {
    lib_user_id: number,
    rfid: number | null,
    username: string,
    first_name: string,
    middle_initial: string | null,
    last_name: string,
    phone_number: string,
    is_approved: boolean,
    is_active: boolean,
    college_id: number,
    program_id: number,
    user_type_id: number
}

export type AdminTable = {
    admin_id: number,
    rfid: string,
    nickname: string,
    email: string,
    is_active: boolean,
    is_approved: boolean,
    library: string,
    section: string,
}

export type ServiceTable = {
    service_id: number,
    service_type_id: number,
    service: string,
    in_use: boolean,
    library_id: number,
    section_id: number,
}

export type ServiceView = {
    service_id: number,
    service_type: string,
    service: string,
    in_use: boolean,
    section: string, 
}

export type ServiceTypeTable = {
    service_type_id: number,
    service_type: string
}

export type UsageLogView = {
    usagelog_id: number,
    start: Date | null,
    end: Date | null,
    is_active: boolean,
    service_id: number,
    service: string,
    service_type: string,
    lib_user_id: number,
    first_name: string,
    last_name: string,
    section: string,
    admin_id1: number,
    admin_id2: number
}

export type UsageLogTable = {
    start: string | null,
    end: string | null,
    usagelog_id: number
    service_id: number,
    lib_user_id: number,
    admin_id1: number,
    admin_id2: number,
    is_active:boolean,
}