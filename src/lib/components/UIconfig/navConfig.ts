import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import * as Icons from './icons';

export type Route = {
	title: string;
	label: string;
	icon: ComponentType<Icon>;
	variant: 'default' | 'ghost';
};

export const studentRoutes: Route[] = [
	{
		title: 'Library Services',
		label: '',
		icon: Icons.Inbox,
		variant: 'default'
	},
	{
		title: 'History',
		label: '',
		icon: Icons.File,
		variant: 'ghost'
	},
	{
		title: 'About SUSe',
		label: '',
		icon: Icons.Trash2,
		variant: 'ghost'
	},
	{
		title: 'Send Feedback',
		label: '',
		icon: Icons.Archive,
		variant: 'ghost'
	}
];

export const adminRoutes: Route[] = [
	{
		title: 'Students',
		label: '',
		icon: Icons.Users,
		variant: 'ghost'
	},
	{
		title: 'Services',
		label: '',
		icon: Icons.CircleAlert,
		variant: 'ghost'
	},
	{
		title: 'Usage Logs',
		label: '',
		icon: Icons.MessagesSquare,
		variant: 'ghost'
	},
	{
		title: 'Admin',
		label: '',
		icon: Icons.ShoppingCart,
		variant: 'ghost'
	}
];
