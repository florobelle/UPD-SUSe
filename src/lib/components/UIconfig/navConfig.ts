import type { Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import * as Icons from './icons';

export type Route = {
	title: string;
	id: string;
	icon: ComponentType<Icon>;
	url: string;
};

export const studentRoutes: Route[] = [
	{
		title: 'Library Services',
		id: 'services',
		icon: Icons.PencilRuler,
		url: './services'
	},
	{
		title: 'Link UP ID',
		id: 'link-rfid',
		icon: Icons.IDCard,
		url: './link-rfid'
	},
	{
		title: 'About SUSê',
		id: 'about',
		icon: Icons.Info,
		url: ''
	},
	{
		title: 'Send Feedback',
		id: 'feedback-form',
		icon: Icons.MessageCircleHeart,
		url: './feedback-form'
	}
];

export const adminRoutes: Route[] = [
	{
		title: 'Library Users',
		id: 'users',
		icon: Icons.Users,
		url: './users'
	},
	{
		title: 'Services',
		id: 'services',
		icon: Icons.CircleAlert,
		url: './services'
	},
	{
		title: 'Usage Logs',
		id: 'usagelogs',
		icon: Icons.MessagesSquare,
		url: './usagelogs'
	},
	{
		title: 'Administrators',
		id: 'administrators',
		icon: Icons.ShoppingCart,
		url: './administrators'
	},
	{
		title: 'Statistics',
		id: 'statistics',
		icon: Icons.AlignEndHorizontal,
		url: './statistics'
	},
	{
		title: 'Settings',
		id: 'settings',
		icon: Icons.Settings,
		url: './settings'
	}
];
