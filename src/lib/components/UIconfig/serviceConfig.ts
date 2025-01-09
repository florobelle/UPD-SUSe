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

export type serviceUI = {
	serviceName: string;
	serviceID: number;
	serviceImgSrc: string;
};

export const services: serviceUI[] = [
	{
		serviceName: 'Umbrella',
		serviceID: 1,
		serviceImgSrc: '../../../services/umbrella.png'
	},
	{
		serviceName: 'Reading Glasses',
		serviceID: 2,
		serviceImgSrc: '../../../services/glasses.png'
	},
	{
		serviceName: 'Extension Cord',
		serviceID: 3,
		serviceImgSrc: '../../../services/extension-cord.png'
	},
	{
		serviceName: 'Adapter',
		serviceID: 4,
		serviceImgSrc: '../../../services/adapter.png'
	},
	{
		serviceName: 'Laptop',
		serviceID: 5,
		serviceImgSrc: '../../../services/laptop.png'
	},
	{
		serviceName: 'Calculator',
		serviceID: 6,
		serviceImgSrc: '../../../services/calculator.png'
	},
	{
		serviceName: 'Discussion Room',
		serviceID: 7,
		serviceImgSrc: '../../../services/discussion-room.png'
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
