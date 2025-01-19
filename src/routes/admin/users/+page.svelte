<script>
	import DataTable from '$lib/components/ui/data-table/data-table.svelte';
	import { columns } from './columns';
	import { users } from './data';

	export const initialSort = [
		{ id: 'is_enrolled', desc: false },
		{ id: 'is_active', desc: true }
	];
</script>

<div class="flex w-full justify-center">
	<div class="w-[95%]">
		<DataTable data={users} {columns} {initialSort} />
	</div>
</div>
