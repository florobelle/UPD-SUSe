import { writable, type Writable } from "svelte/store";

type UserInformation =  {
    authenticated: boolean,
    username: string
}

export const UserStore: Writable<UserInformation> = writable({
    authenticated: false,
    username: ''
})