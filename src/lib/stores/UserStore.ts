import { writable, type Writable } from "svelte/store";

export type formData = {
    userName: string,
    rfid: string,
    firstName: string,
    middleName: string,
    lastName: string,
    phoneNum: string,
    userType: string,
    college: string,
    program: string,
    IDNum: string        
}

type UserInformation =  {
    authenticated: boolean,
    toRegister: boolean,
    formData: formData
}

export const UserStore: Writable<UserInformation> = writable({
    authenticated: false,
    toRegister: false,
    formData: {
        userName: '',
        firstName: '',
        rfid: '',
        middleName: '',
        lastName: '',
        phoneNum: '',
        userType: '',
        college: '',
        program: '',
        IDNum: ''
    }
})