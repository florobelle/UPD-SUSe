import type { UsageLogView } from '$lib/dataTypes/EntityTypes';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableActions from '$lib/components/ui/data-table/data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableHeaderButton from '$lib/components/ui/data-table/data-table-header-button.svelte';
import DataTableEditableCell from '$lib/components/ui/data-table/data-table-editable-cell.svelte';
import { type TableEditT } from '$lib/dataTypes/tableTypes';

const createSortableColumn = (
	accessorKey: string,
	header: string,
	editT: TableEditT
): ColumnDef<UsageLogView> => ({
	accessorKey,
	header: ({ column }) =>
		renderComponent(DataTableHeaderButton, {
			header,
			onclick: () => {
				const isSorted = column.getIsSorted();
				column.toggleSorting(column.getIsSorted() === 'asc');
			}
		}),
	cell: ({ row }) =>
		renderComponent(DataTableEditableCell, {
			id: row.original.usagelog_id,
			colId: accessorKey,
			editT,
			initVal: row.getValue(accessorKey)
		})
});

export const columns: ColumnDef<UsageLogView>[] = [
	{
		id: 'is_active',
		header: ({ column }) => {
			return renderComponent(DataTableHeaderButton, {
				header: 'Is Active',
				onclick: () => {
					const isSorted = column.getIsSorted();
					column.toggleSorting(isSorted === 'asc');
				}
			});
		},
		cell: ({ row }) => {
			const activeCellSnippet = createRawSnippet<[{ start: any; end: any }]>((getData) => {
				const { start, end } = getData();

				const startDate = new Date(start);
				const endDate = new Date(end);

				const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
				const isWithin3Seconds = timeDifference <= 5000;

				let dotColor = 'bg-gray-400';
				if (isWithin3Seconds) {
					dotColor = 'bg-green-500';
				}

				return {
					render: () => `
						<div class="flex justify-center">
							<div class="${dotColor} w-2 h-2 rounded-full"></div>
						</div>
						`
				};
			});

			return renderSnippet(activeCellSnippet, {
				start: row.original.start,
				end: row.original.end
			});
		}
	},
	createSortableColumn('usagelog_id', 'ID', ''),
	createSortableColumn('start', 'Start Time', 'datetime'),
	createSortableColumn('end', 'End Time', 'datetime'),
	createSortableColumn('service', 'Service', 'text'),
	createSortableColumn('service_type', 'Service Type', 'text'),
	createSortableColumn('lib_user_id', 'User ID', ''),
	createSortableColumn('first_name', 'First Name', 'text'),
	createSortableColumn('last_name', 'Last Name', 'text'),
	createSortableColumn('admin_id1', 'Admin ID 1', ''),
	createSortableColumn('admin_id2', 'Admin ID 2', ''),
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.usagelog_id, row: row.original });
		}
	}
];
