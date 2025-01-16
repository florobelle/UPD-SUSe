import { type ServiceView } from '$lib/dataTypes/EntityTypes'

export type serviceInput = {
	type: string;
	label: string;
	options: ServiceView[];
	variant: 'default' | 'ghost';
};


export type availableServicesUI = {
	service_type: string;
	service_type_id: number;
	available_number: number;
	service_img_src: string;
};

export const servicesInfo: availableServicesUI[] = [
	{
		service_type: 'Adapter',
		service_type_id: 1,
		available_number: 0,
		service_img_src: '../../../services/adapter.png'
	},
	{
		service_type: 'Calculator',
		service_type_id: 2,
		available_number: 0,
		service_img_src: '../../../services/calculator.png'
	},
	{
		service_type: 'Discussion Room',
		service_type_id: 3,
		available_number: 0,
		service_img_src: '../../../services/discussion-room.png'
	},
	{
		service_type: 'Extension Cord',
		service_type_id: 4,
		available_number: 0,
		service_img_src: '../../../services/extension-cord.png'
	},
	{
		service_type: 'Laptop',
		service_type_id: 5,
		available_number: 0,
		service_img_src: '../../../services/laptop.png'
	},
	{
		service_type: 'Reading Glasses',
		service_type_id: 6,
		available_number: 0,
		service_img_src: '../../../services/glasses.png'
	},
	{
		service_type: 'Umbrella',
		service_type_id: 7,
		available_number: 0,
		service_img_src: '../../../services/umbrella.png'
	}
];

export const serviceForms: serviceInput[][] = [
	// Adapter
	[
		{
			type: 'select',
			label: 'Adapter Number',
			options: []
			,
			variant: 'default'
		}
	],

	// Calculator
	[
		{
			type: 'select',
			label: 'Calculator Number',
			options: []
			,
			variant: 'default'
		}
	],

	// Discussion Room
	[
		{
			type: 'select',
			label: 'Discussion Room Name',
			options: [],
			variant: 'default'
		}
	],

	// Extension Cord
	[
		{
			type: 'select',
			label: 'Extension Cord Number',
			options: []
			,
			variant: 'default'
		}
	],

	// Laptop
	[
		{
			type: 'select',
			label: 'Laptop Number',
			options: []
			,
			variant: 'default'
		}
	],
	
	// Reading Glasses
	[
		{
			type: 'select',
			label: 'Grade',
			options: []
			,
			variant: 'default'
		}
	],

	// Umbrella
	[
		{
			type: 'select',
			label: 'Small Orange Umbrella',
			options: [],
			variant: 'default'
		},
		{
			type: 'select',
			label: 'Small Black Umbrella',
			options: [],
			variant: 'default'
		},
		{
			type: 'select',
			label: 'Big Orange Umbrella',
			options: []
			,
			variant: 'default'
		}
	],
];
