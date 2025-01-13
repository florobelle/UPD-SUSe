import { type ServiceView } from '$lib/dataTypes/EntityTypes'

type option = {
	value: string;
	label: string;
};

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
				{ service_id: 1, service: 'Orange Small Umbrella 1', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 2, service: 'Orange Small Umbrella 2', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 3, service: 'Orange Small Umbrella 3', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 4, service: 'Orange Small Umbrella 4', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 5, service: 'Orange Small Umbrella 5', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 6, service: 'Orange Small Umbrella 6', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 7, service: 'Orange Small Umbrella 7', service_type: 'Umbrella', in_use: false, section: 'Circulation' }
			],
			variant: 'default'
		},
		{
			type: 'select',
			label: 'Black Small Umbrella',
			options: [
				{ service_id: 8, service: 'Black Small Umbrella 8', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 9, service: 'Black Small Umbrella 9', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 10, service: 'Black Small Umbrella 10', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 11, service: 'Black Small Umbrella 11', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 12, service: 'Black Small Umbrella 12', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 14, service: 'Black Small Umbrella 14', service_type: 'Umbrella', in_use: false, section: 'Circulation' }
			],
			variant: 'default'
		},
		{
			type: 'select',
			label: 'Orange Big Umbrella',
			options: [
				{ service_id: 2, service: 'Orange Big Umbrella 2', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 5, service: 'Orange Big Umbrella 3', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 6, service: 'Orange Big Umbrella 6', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 8, service: 'Orange Big Umbrella 8', service_type: 'Umbrella', in_use: false, section: 'Circulation' },
				{ service_id: 9, service: 'Orange Big Umbrella 9', service_type: 'Umbrella', in_use: false, section: 'Circulation' }
			]
			,
			variant: 'default'
		}
	],

	// Reading Glasses
	[
		{
			type: 'select',
			label: 'Grade',
			options: [
				{ service_id: 1, service: '1.00', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 2, service: '1.25', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 3, service: '1.50', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 4, service: '1.75', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 5, service: '2.25', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 6, service: '2.50', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 7, service: '3.00', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 8, service: '3.25', service_type: 'Glasses', in_use: false, section: 'Circulation' },
				{ service_id: 9, service: '3.50', service_type: 'Glasses', in_use: false, section: 'Circulation' }
			]
			,
			variant: 'default'
		}
	],

	// Extension Cord
	[
		{
			type: 'select',
			label: 'Extension Cord Number',
			options: [
				{ service_id: 1, service: 'Extension Cord 1', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 2, service: 'Extension Cord 2', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 3, service: 'Extension Cord 3', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 4, service: 'Extension Cord 4', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 5, service: 'Extension Cord 5', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 6, service: 'Extension Cord 6', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 7, service: 'Extension Cord 7', service_type: 'Extension Cord', in_use: false, section: 'Circulation' },
				{ service_id: 8, service: 'Extension Cord 8', service_type: 'Extension Cord', in_use: false, section: 'Circulation' }
			]
			,
			variant: 'default'
		}
	],

	// Adapter
	[
		{
			type: 'select',
			label: 'Adapter Number',
			options: [
				{ service_id: 1, service: 'Adapter 1', service_type: 'Adapter', in_use: false, section: 'Circulation' },
				{ service_id: 2, service: 'Adapter 2', service_type: 'Adapter', in_use: false, section: 'Circulation' },
				{ service_id: 3, service: 'Adapter 3', service_type: 'Adapter', in_use: false, section: 'Circulation' },
				{ service_id: 4, service: 'Adapter 4', service_type: 'Adapter', in_use: false, section: 'Circulation' }
			]
			,
			variant: 'default'
		}
	],

	// Laptop
	[
		{
			type: 'select',
			label: 'Laptop Number',
			options: [
				{ service_id: 1, service: 'Laptop 1', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 2, service: 'Laptop 2', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 3, service: 'Laptop 3', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 4, service: 'Laptop 4', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 6, service: 'Laptop 6', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 7, service: 'Laptop 7', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 8, service: 'Laptop 8', service_type: 'Laptop', in_use: false, section: 'Circulation' },
				{ service_id: 10, service: 'Laptop 10', service_type: 'Laptop', in_use: false, section: 'Circulation' }
			]
			,
			variant: 'default'
		}
	],

	// Calculator

	[
		{
			type: 'select',
			label: 'Calculator Number',
			options: [
				{ service_id: 21, service: 'Calculator 21', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 22, service: 'Calculator 22', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 23, service: 'Calculator 23', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 24, service: 'Calculator 24', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 25, service: 'Calculator 25', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 26, service: 'Calculator 26', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 27, service: 'Calculator 27', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 28, service: 'Calculator 28', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 29, service: 'Calculator 29', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 30, service: 'Calculator 30', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 31, service: 'Calculator 31', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 32, service: 'Calculator 32', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 33, service: 'Calculator 33', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 34, service: 'Calculator 34', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 35, service: 'Calculator 35', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 36, service: 'Calculator 36', service_type: 'Calculator', in_use: false, section: 'Circulation' },
				{ service_id: 37, service: 'Calculator 37', service_type: 'Calculator', in_use: false, section: 'Circulation' }
			]
			,
			variant: 'default'
		}
	],

	// Discussion Room
	[
		{
			type: 'select',
			label: 'Discussion Room Name',
			options: [
				{ service_id: 1, service: 'Frequency', service_type: 'Discussion Room', in_use: false, section: 'Circulation' },
				{ service_id: 2, service: 'Programming', service_type: 'Discussion Room', in_use: false, section: 'Circulation' },
				{ service_id: 3, service: 'Signal', service_type: 'Discussion Room', in_use: false, section: 'Circulation' },
				{ service_id: 4, service: 'Transistor', service_type: 'Discussion Room', in_use: false, section: 'Circulation' }
			],
			variant: 'default'
		}
	]
];
