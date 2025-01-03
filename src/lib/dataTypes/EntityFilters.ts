export type UserFilter = {
    id: number,
    is_enrolled: boolean | null,
    is_active: boolean | null,
    college: string,
    unit: string,
    program: string,
    user_type: string
}