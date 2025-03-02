import type { AdminTable } from "$lib/dataTypes/EntityTypes";
import { writable, type Writable } from "svelte/store";

export type AdminFormData = {
    admin_id: number,
    rfid: string,
    nickname: string,
    email: string,
    is_approved: boolean,
    library: string,
    section: string
}

type AdminInformation = {
    toLogin: boolean,
    authenticated: boolean,
    toRegister: boolean,
    active_admin1: AdminTable | null,
    active_admin2: AdminTable | null,
    formData: AdminFormData
}

export const AdminStore: Writable<AdminInformation> = writable({
    toLogin: false,
    authenticated: false,
    toRegister: false,
    active_admin1: null,
    active_admin2: null,
    formData: {
        admin_id: 0,
        rfid: '',
        nickname: '',
        email: '',
        is_approved: false,
        library: '',
        section: ''
    }
})

export const AdminTableStore: Writable<Array<AdminTable>> = writable([]);

export const isPCVerified: Writable<{isCalled: boolean, isVerified:boolean}> = writable({ isCalled: false, isVerified: false});