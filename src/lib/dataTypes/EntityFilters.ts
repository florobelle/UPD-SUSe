export type UserFilter = {
    id: number,
    is_enrolled: boolean | null,
    is_active: boolean | null,
    college: string,
    unit: string,
    program: string,
    user_type: string
}

export type ServiceFilter = {
    type: string,
    in_use: boolean | null,
    library: string,
    section: string, 
}