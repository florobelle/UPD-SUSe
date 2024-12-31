import { writable, type Writable } from "svelte/store";

type UserInformation =  {
    authenticated: boolean,
    fullName: string,
    email: string
}

export const UserStore: Writable<UserInformation> = writable({
    authenticated: false,
    fullName: '',
    email: ''
})