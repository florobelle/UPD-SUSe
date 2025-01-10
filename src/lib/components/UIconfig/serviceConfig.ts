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
	// Umbrella

	[
		{
			type: 'select',
			label: 'Orange Small Umbrella',
			options: [
				{ value: '1', label: 'Orange Small Umbrella 1' },
				{ value: '2', label: 'Orange Small Umbrella 2' },
				{ value: '3', label: 'Orange Small Umbrella 3' },
				{ value: '4', label: 'Orange Small Umbrella 4' },
				{ value: '5', label: 'Orange Small Umbrella 5' },
				{ value: '6', label: 'Orange Small Umbrella 6' },
				{ value: '7', label: 'Orange Small Umbrella 7' }
			],
			variant: 'default'
		},
		{
			type: 'select',
			label: 'Black Small Umbrella',
			options: [
				{ value: '8', label: 'Black Small Umbrella 8' },
				{ value: '9', label: 'Black Small Umbrella 9' },
				{ value: '10', label: 'Black Small Umbrella 10' },
				{ value: '11', label: 'Black Small Umbrella 11' },
				{ value: '12', label: 'Black Small Umbrella 12' },
				{ value: '14', label: 'Black Small Umbrella 14' }
			],
			variant: 'default'
		},
		{
			type: 'select',
			label: 'Orange Big Umbrella',
			options: [
				{ value: '2', label: 'Orange Big Umbrella 2' },
				{ value: '5', label: 'Orange Big Umbrella 3' },
				{ value: '6', label: 'Orange Big Umbrella 6' },
				{ value: '8', label: 'Orange Big Umbrella 8' },
				{ value: '9', label: 'Orange Big Umbrella 9' }
			],
			variant: 'default'
		}
	],

	// Reading Glasses
	[
		{
			type: 'select',
			label: 'Grade',
			options: [
				{ value: '1.00', label: '1.00' },
				{ value: '1.25', label: '1.25' },
				{ value: '1.50', label: '1.50' },
				{ value: '1.75', label: '1.75' },
				{ value: '2.00', label: '2.25' },
				{ value: '2.50', label: '2.50' },
				{ value: '3.00', label: '3.00' },
				{ value: '3.25', label: '3.25' },
				{ value: '3.50', label: '3.50' }
			],
			variant: 'default'
		}
	],

	// Extension Cord
	[
		{
			type: 'select',
			label: 'Extension Cord Number',
			options: [
				{ value: '1', label: 'Extension Cord 1' },
				{ value: '2', label: 'Extension Cord 2' },
				{ value: '3', label: 'Extension Cord 3' },
				{ value: '4', label: 'Extension Cord 4' },
				{ value: '5', label: 'Extension Cord 5' },
				{ value: '6', label: 'Extension Cord 6' },
				{ value: '7', label: 'Extension Cord 7' },
				{ value: '8', label: 'Extension Cord 8' }
			],
			variant: 'default'
		}
	],

	// Adapter
	[
		{
			type: 'select',
			label: 'Adapter Number',
			options: [
				{ value: '1', label: 'Adapter 1' },
				{ value: '2', label: 'Adapter 2' },
				{ value: '3', label: 'Adapter 3' },
				{ value: '4', label: 'Adapter 4' }
			],
			variant: 'default'
		}
	],

	// Laptop
	[
		{
			type: 'select',
			label: 'Laptop Number',
			options: [
				{ value: '1', label: 'Laptop 1' },
				{ value: '2', label: 'Laptop 2' },
				{ value: '3', label: 'Laptop 3' },
				{ value: '4', label: 'Laptop 4' },
				{ value: '6', label: 'Laptop 6' },
				{ value: '7', label: 'Laptop 7' },
				{ value: '8', label: 'Laptop 8' },
				{ value: '10', label: 'Laptop 10' }
			],
			variant: 'default'
		}
	],

	// Calculator

	[
		{
			type: 'select',
			label: 'Calculator Number',
			options: [
				{ value: '21', label: 'Calculator 21' },
				{ value: '22', label: 'Calculator 22' },
				{ value: '23', label: 'Calculator 23' },
				{ value: '24', label: 'Calculator 24' },
				{ value: '25', label: 'Calculator 25' },
				{ value: '26', label: 'Calculator 26' },
				{ value: '27', label: 'Calculator 27' },
				{ value: '28', label: 'Calculator 28' },
				{ value: '29', label: 'Calculator 29' },
				{ value: '30', label: 'Calculator 30' },
				{ value: '31', label: 'Calculator 31' },
				{ value: '32', label: 'Calculator 32' },
				{ value: '33', label: 'Calculator 33' },
				{ value: '34', label: 'Calculator 34' },
				{ value: '35', label: 'Calculator 35' },
				{ value: '36', label: 'Calculator 36' },
				{ value: '27', label: 'Calculator 37' }
			],
			variant: 'default'
		}
	],

	// Discussion Room
	[
		{
			type: 'select',
			label: 'Discussion Room Name',
			options: [
				{ value: '1', label: 'Frequency' },
				{ value: '2', label: 'Programming' },
				{ value: '3', label: 'Signal' },
				{ value: '4', label: 'Transistor' }
			],
			variant: 'default'
		}
	]
];
