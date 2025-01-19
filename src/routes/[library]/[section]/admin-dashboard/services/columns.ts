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
	// {
	// 	accessorKey: 'end',
	// 	header: ({ column }) => {
	// 		return renderComponent(DataTableHeaderButton, {
	// 			header: 'Status',
	// 			onclick: () => {
	// 				const isSorted = column.getIsSorted();
	// 				column.toggleSorting(isSorted === 'asc');
	// 			}
	// 		});
	// 	},
	// 	cell: ({ row }) => {
	// 		const activeCellSnippet = createRawSnippet<[{ active: any; enrolled: any }]>((getData) => {
	// 			const { active, enrolled } = getData();

	// 			let dotColor = 'bg-gray-400';
	// 			if (enrolled) {
	// 				if (active) {
	// 					dotColor = 'bg-green-500';
	// 				}
	// 			} else if (!enrolled) {
	// 				dotColor = 'bg-yellow-400';
	// 			}

	// 			return {
	// 				render: () => `
	// 					<div class="flex justify-center">
	// 						<div class="${dotColor} w-2 h-2 rounded-full"></div>
	// 					</div>
	// 					`
	// 			};
	// 		});

	// 		return renderSnippet(activeCellSnippet, {
	// 			active: row.getValue('is_active'),
	// 			enrolled: row.getValue('is_enrolled')
	// 		});
	// 	}
	// },
	// {
	// 	accessorKey: 'is_enrolled',
	// 	header: () => {
	// 		const activeHeaderSnippet = createRawSnippet(() => ({
	// 			render: () => `<div></div>`
	// 		}));
	// 		return renderSnippet(activeHeaderSnippet, '');
	// 	},
	// 	cell: () => {
	// 		const activeCellSnippet = createRawSnippet(() => ({
	// 			render: () => `<div></div>`
	// 		}));
	// 		return renderSnippet(activeCellSnippet, '');
	// 	}
	// },

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
