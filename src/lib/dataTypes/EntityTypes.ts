export type User = {
    id: number,
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