import type { AdminTable } from '$lib/dataTypes/EntityTypes';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableActions from '$lib/components/ui/data-table/data-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableHeaderButton from '$lib/components/ui/data-table/data-table-header-button.svelte';
import DataTableEditableCell from '$lib/components/ui/data-table/data-table-editable-cell.svelte';
import { type TableEditT } from '$lib/dataTypes/tableTypes';
import DataTableActiveToggle from '$lib/components/ui/data-table/data-table-active-toggle.svelte';

const createSortableColumn = (
	accessorKey: string,
	header: string,
	editT: TableEditT
): ColumnDef<AdminTable> => ({
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
			id: row.original.admin_id,
			colId: accessorKey,
			editT,
			initVal: row.getValue(accessorKey)
		})
});

export const columns: ColumnDef<AdminTable>[] = [
	{
		accessorKey: 'is_active',
		header: 'Is Active',
		cell: ({ row }) => {
			return renderComponent(DataTableActiveToggle, {
				row: row.original,
				isApproved: row.original.is_approved
			});
		}
	},
	createSortableColumn('admin_id', 'ID', ''),
	createSortableColumn('nickname', 'Nickname', 'text'),
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.admin_id, row: row.original });
		}
	}
];
