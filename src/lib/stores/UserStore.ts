import type { UserTable } from '$lib/dataTypes/EntityTypes';
import { writable, type Writable } from 'svelte/store';

export type UserFormData = {
	username: string;
	rfid: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	phone_number: string;
	user_type: string;
	college: string;
	program: string;
	lib_user_id: string;
    is_approved: boolean;
};

type UserInformation = {
	authenticated: boolean;
	toRegister: boolean;
	formData: UserFormData;
};

export const UserStore: Writable<UserInformation> = writable({
	authenticated: false,
	toRegister: false,
	formData: {
		username: '',
		first_name: '',
		rfid: '',
		middle_name: '',
		last_name: '',
		phone_number: '',
		user_type: '',
		college: '',
		program: '',
		lib_user_id: '',
        is_approved: false
	}
});

export let UserTableStore: Writable<Array<UserTable>> = writable();