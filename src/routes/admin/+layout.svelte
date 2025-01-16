<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable';
	import Nav from '$lib/components/Nav.svelte';
	import { adminRoutes } from '$lib/components/UIconfig/navConfig';

	let defaultLayout = [100, 440, 655];
	let defaultCollapsed = false;
	let navCollapsedSize: number = 4;
	let isCollapsed = defaultCollapsed;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}

	// Session
	async function logOutUser() {
		console.log('logout');
	}
</script>

<div class="hidden h-full md:block">
	<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="items-stretch">
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			collapsedSize={navCollapsedSize}
			collapsible
			minSize={15}
			maxSize={20}
			{onCollapse}
			{onExpand}
		>
			<Nav {logOutUser} {isCollapsed} routes={adminRoutes} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[2]}>
			<slot></slot>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
