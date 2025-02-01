<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { cn } from '$lib/utilsFront.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import { LogOut } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { UserStore } from '$lib/stores/UserStore';
	import { AdminStore } from '$lib/stores/AdminStore';
	import Separator from './ui/separator/separator.svelte';

	let { logOutUser, isCollapsed, routes } = $props();

	export const getVariant = (pathname: string, match: string): 'default' | 'ghost' => {
		return pathname.endsWith(match) ? 'default' : 'ghost';
	};
</script>

<div
	data-collapsed={isCollapsed}
	class="group flex h-screen flex-col gap-4 pt-8 data-[collapsed=true]:pt-8"
>
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#if $UserStore.formData.first_name !== ''}
			<div class="mb-2 flex flex-col gap-2 p-2 group-[[data-collapsed=true]]:hidden">
				<div>
					<h1 class="text-sm">Welcome,</h1>
					<h2 class="text-lg font-medium">{$UserStore.formData.first_name}</h2>
				</div>
				<Separator />
			</div>
		{:else}
			<div class="mb-2 flex flex-col gap-2 p-2 group-[[data-collapsed=true]]:hidden">
				<div>
					<h1 class="text-sm">Welcome,</h1>
					<h2 class="text-lg font-medium">{$AdminStore.formData.nickname}</h2>
				</div>
				<Separator />
			</div>
		{/if}
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							href={route.url}
							builders={[builder]}
							variant={getVariant($page.url.pathname, route.id)}
							size="icon"
							class={cn(
								'size-9',
								route.variant === 'default' &&
									'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
							)}
						>
							<svelte:component this={route.icon} class="size-4" aria-hidden="true" />
							<span class="sr-only">{route.title}</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="flex items-center gap-4">
						{route.title}
						{#if route.label}
							<span class="ml-auto text-muted-foreground">
								{route.label}
							</span>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>
			{:else}
				<Button
					href={route.url}
					variant={getVariant($page.url.pathname, route.id)}
					size="sm"
					class={cn('justify-start', {
						'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white':
							route.variant === 'default'
					})}
				>
					<svelte:component this={route.icon} class="mr-2 size-4" aria-hidden="true" />
					{route.title}
					{#if route.label}
						<span
							class={cn('ml-auto', {
								'text-background dark:text-white': route.variant === 'default'
							})}
						>
							{route.label}
						</span>
					{/if}
				</Button>
			{/if}
		{/each}
	</nav>
	<div
		class="mt-auto grid gap-1 px-2 pb-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#if isCollapsed}
			<Button
				on:click={logOutUser}
				class="inline-flex size-9 items-center justify-center whitespace-nowrap rounded-md bg-primary text-sm text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				href="#"
				size="icon"
			>
				<svelte:component this={LogOut} class="size-4 w-full" aria-hidden="true" />
				<span class="sr-only">Logout</span>
			</Button>
		{:else}
			<Button
				on:click={logOutUser}
				class="h-9 w-full justify-start gap-2 pl-3 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
			>
				<svelte:component this={LogOut} class="size-4" aria-hidden="true" />

				<span class="text-background dark:text-white">Logout</span>
			</Button>
		{/if}
	</div>
</div>
