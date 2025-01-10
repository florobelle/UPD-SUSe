type option = {
	value: string;
	label: string;
};

export type serviceInput = {
	type: string;
	label: string;
	options: option[];
	variant: 'default' | 'ghost';
};

export type availableServicesUI = {
	service_type: string;
	service_type_id: number;
	available_number: number;
	service_img_src: string;
};

export const services: availableServicesUI[] = [
	{
		service_type: 'Umbrella',
		service_type_id: 1,
		available_number: 2,
		service_img_src: '../../../services/umbrella.png'
	},
	{
		service_type: 'Reading Glasses',
		service_type_id: 2,
		available_number: 2,
		service_img_src: '../../../services/glasses.png'
	},
	{
		service_type: 'Extension Cord',
		service_type_id: 3,
		available_number: 2,
		service_img_src: '../../../services/extension-cord.png'
	},
	{
		service_type: 'Adapter',
		service_type_id: 4,
		available_number: 2,
		service_img_src: '../../../services/adapter.png'
	},
	{
		service_type: 'Laptop',
		service_type_id: 5,
		available_number: 2,
		service_img_src: '../../../services/laptop.png'
	},
	{
		service_type: 'Calculator',
		service_type_id: 6,
		available_number: 2,
		service_img_src: '../../../services/calculator.png'
	},
	{
		service_type: 'Discussion Room',
		service_type_id: 7,
		available_number: 2,
		service_img_src: '../../../services/discussion-room.png'
	}
];

export const serviceForms: serviceInput[][] = [
	[
		{
			type: 'input',
			label: 'model',
			options: [],
			variant: 'default'
		}
	],
	[
		{
			type: 'select',
			label: 'model',
			options: [
				{ value: 'Model 1', label: 'Model 1 Label' },
				{ value: 'Model 2', label: 'Model 2 Label' }
			],
			variant: 'default'
		}
	],
	[
		{
			type: 'input',
			label: 'model',
			options: [],
			variant: 'default'
		}
	],

	[
		{
			type: 'input',
			label: 'model',
			options: [],
			variant: 'default'
		}
	],

	[
		{
			type: 'input',
			label: 'model',
			options: [],
			variant: 'default'
		}
	],
	[
		{
			type: 'input',
			label: 'model',
			options: [],
			variant: 'default'
		}
	],
	[
		{
			type: 'input',
			label: 'model',
			options: [],
			variant: 'default'
		}
	]
];
