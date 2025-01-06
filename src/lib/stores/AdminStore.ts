import { writable, type Writable } from "svelte/store";

export type AdminFormData = {
    id: number,
    rfid: string,
    nickname: string,
    email: string,
    library: string,
    section: string
}

type AdminInformation = {
    authenticated: boolean,
    toRegister: boolean,
    formData: AdminFormData
}

export const AdminStore: Writable<AdminInformation> = writable({
    authenticated: false,
    toRegister: false,
    formData: {
        id: 0,
        rfid: '',
        nickname: '',
        email: '',
        library: '',
        section: ''
    }
})