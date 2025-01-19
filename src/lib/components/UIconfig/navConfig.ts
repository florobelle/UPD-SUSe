import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import * as Icons from './icons';

export type Route = {
	title: string;
	label: string;
	icon: ComponentType<Icon>;
	variant: 'default' | 'ghost';
    url: string;
};

export const studentRoutes: Route[] = [
	{
		title: 'Library Services',
		label: '',
		icon: Icons.PencilRuler,
		variant: 'default',
        url: ''
	},
	{
		title: 'History',
		label: '',
		icon: Icons.Logs,
		variant: 'ghost',
        url: ''
	},
	{
		title: 'About SUSê',
		label: '',
		icon: Icons.Info,
		variant: 'ghost',
        url: ''
	},
	{
		title: 'Send Feedback',
		label: '',
		icon: Icons.MessageCircleHeart,
		variant: 'ghost',
        url: ''
	}
];

export const adminRoutes: Route[] = [
	{
		title: 'Library Users',
		label: '',
		icon: Icons.Users,
		variant: 'default',
        url: './users'
	},
	{
		title: 'Services',
		label: '',
		icon: Icons.CircleAlert,
		variant: 'ghost',
        url: './services'
	},
	{
		title: 'Usage Logs',
		label: '',
		icon: Icons.MessagesSquare,
		variant: 'ghost',
        url: './usagelogs'
	},
	{
		title: 'Administrators',
		label: '',
		icon: Icons.ShoppingCart,
		variant: 'ghost',
        url: './administrators'
	}
];
