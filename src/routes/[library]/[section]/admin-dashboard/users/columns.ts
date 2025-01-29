import type { UserView } from '$lib/dataTypes/EntityTypes';
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
): ColumnDef<UserView> => ({
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
			id: row.original.lib_user_id,
			colId: accessorKey,
			editT,
			initVal: row.getValue(accessorKey)
		})
});

export const columns: ColumnDef<UserView>[] = [
	{
		accessorKey: 'is_active',
		header: ({ column }) => {
			return renderComponent(DataTableHeaderButton, {
				header: 'Status',
				onclick: () => {
					column.toggleSorting(column.getIsSorted() === 'asc');
				}
			});
		},

		cell: ({ row }) => {
			const activeCellSnippet = createRawSnippet<[{ active: any; approved: any }]>((getData) => {
				const { active, approved } = getData();

				let dotColor = 'bg-gray-400';
				if (approved) {
					if (active) {
						dotColor = 'bg-green-500';
					}
				} else if (!approved) {
					dotColor = 'bg-yellow-400';
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
				active: row.getValue('is_active'),
				approved: row.getValue('is_approved')
			});
		}
	},

	createSortableColumn('lib_user_id', 'ID', ''),
	createSortableColumn('username', 'Username', 'text'),
	createSortableColumn('first_name', 'First Name', 'text'),
	createSortableColumn('middle_initial', 'M.I.', 'text'),
	createSortableColumn('last_name', 'Last Name', 'text'),
	createSortableColumn('college', 'College', 'college'),
	createSortableColumn('program', 'Program', 'program'),
	createSortableColumn('user_type', 'User Type', 'user_type'),

	{
		accessorKey: 'is_approved',
		header: () => {},
		cell: () => {}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, {
				id: row.original.lib_user_id,
				row: row.original
			});
		}
	}
];
