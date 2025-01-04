import type { User } from "./EntityTypes"

export type UserResponse = {
    users: Array<User> | null
    error: string | null
}