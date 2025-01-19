import type { ServiceView } from '$lib/dataTypes/EntityTypes';
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
): ColumnDef<ServiceView> => ({
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
			id: row.original.service_id,
			colId: accessorKey,
			editT,
			initVal: row.getValue(accessorKey)
		})
});

export const columns: ColumnDef<ServiceView>[] = [
	{
		accessorKey: 'in_use',
		header: ({ column }) => {
			return renderComponent(DataTableHeaderButton, {
				header: 'In Use',
				onclick: () => {
					const isSorted = column.getIsSorted();
					column.toggleSorting(isSorted === 'asc');
				}
			});
		},
		cell: ({ row }) => {
			const activeCellSnippet = createRawSnippet<[{ in_use: any }]>((getData) => {
				const { in_use } = getData();

				let dotColor = 'bg-gray-400';
				if (in_use) {
					dotColor = 'bg-green-500';
				}

				return {
					render: () => `
						<div class="flex px-8">
							<div class="${dotColor} w-2 h-2 rounded-full"></div>
						</div>
					`
				};
			});

			return renderSnippet(activeCellSnippet, {
				in_use: row.original.in_use
			});
		}
	},

	createSortableColumn('service_id', 'ID', ''),
	createSortableColumn('service_type', 'Service Type', 'text'),
	createSortableColumn('service', 'Service', 'text'),
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.service_id, row: row.original });
		}
	}
];
