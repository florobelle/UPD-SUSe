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
                    column.toggleSorting(column.getIsSorted() === 'asc');
                }
            });
        },
        accessorFn: (row) => row.is_active,
        cell: ({ row }) => {
            const activeCellSnippet = createRawSnippet<[{ end: any }]>((getData) => {
                const { end } = getData();

                let dotColor = 'bg-gray-400';
                if (end == null) {
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
                end: row.original.end
            });
        }
    },
    createSortableColumn('usagelog_id', 'ID', ''),
    createSortableColumn('start', 'Start Time', 'datetime'),
    createSortableColumn('end', 'End Time', 'datetime'),
    createSortableColumn('service', 'Service', ''),
    createSortableColumn('service_type', 'Service Type', ''),
    createSortableColumn('lib_user_id', 'User ID', ''),
    createSortableColumn('first_name', 'First Name', ''),
    createSortableColumn('last_name', 'Last Name', ''),
    createSortableColumn('admin_nickname1', 'Admin 1', 'text'),
    createSortableColumn('admin_nickname2', 'Admin 2', 'text'),
    {
        id: 'actions',
        cell: ({ row }) => {
            return renderComponent(DataTableActions, { id: row.original.usagelog_id, row: row.original });
        }
    }
];
