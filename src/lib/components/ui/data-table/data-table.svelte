<script lang="ts" generics="TData, TValue">
	// UI imports
	import Button from '../button/button.svelte';
	import * as Select from '../select/index';
	import * as Icons from '../../UIconfig/icons';
	import Input from '../input/input.svelte';
	// Table imports
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import ScrollArea from '../scroll-area/scroll-area.svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	type ExtendedDataTableProps<TData, TValue> = DataTableProps<TData, TValue> & {
		initialSort?: SortingState;
	};
	let { data, columns, initialSort = [] }: ExtendedDataTableProps<TData, TValue> = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 30 });
	let sorting = $state<SortingState>(initialSort);
	let columnFilters = $state<ColumnFiltersState>([]);
	let globalFilter = $state<string>('');

	// Function to filter across all columns
	function handleSearchChange(event: Event) {
		const target = event.target as HTMLInputElement;
		setGlobalFilterChange(target.value);
	}

	// Function to update data
	const updateData = (rowIndex: number, columnId: string, value: any) => {
		// Create a new data array
		data = data.map((row, index) => {
			if (index === rowIndex) {
				return {
					...row,
					[columnId]: value
				};
			}
			return row;
		});
	};

	const setPagination = (updater: any) => {
		if (typeof updater === 'function') {
			pagination = updater(pagination);
		} else {
			pagination = updater;
		}
	};

	const setSortingChange = (updater: any) => {
		if (typeof updater === 'function') {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
	};

	const setFiltersChange = (updater: any) => {
		if (typeof updater === 'function') {
			columnFilters = updater(columnFilters);
		} else {
			columnFilters = updater;
		}
	};

	const setGlobalFilterChange = (value: string) => {
		globalFilter = value;
	};

	function fuzzyMatch(str: string, query: string): boolean {
		if (!query) return true;
		const searchLower = query.toLowerCase();
		const strLower = String(str).toLowerCase();
		return strLower.includes(searchLower);
	}

	const options = {
		meta: {
			updateData
		},
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get globalFilter() {
				return globalFilter;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		onPaginationChange: setPagination,
		onSortingChange: setSortingChange,
		onColumnFiltersChange: setFiltersChange,
		onGlobalFilterChange: setGlobalFilterChange,

		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),

		globalFilterFn: (row: any, columnId: any, filterValue: any) => {
			if (!filterValue) return true;

			const value = row.getValue(columnId);

			if (value == null) return false;

			return fuzzyMatch(String(value), String(filterValue));
		}
	};

	const table = createSvelteTable(options);
</script>

<div class="flex items-center py-4">
	<Input
		placeholder="Search all entries"
		value={globalFilter}
		on:input={handleSearchChange}
		class="max-w-sm"
	/>
</div>

<div class="w-full rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body class="w-full">
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<div class="flex items-center justify-end space-x-2 py-4">
	<Select.Root
		onSelectedChange={(selected) => {
			table.setPageSize(Number(selected?.value));
		}}
		selected={{ value: 30, label: '30' }}
	>
		<Select.Trigger class="h-8 w-[70px]">
			<Select.Value placeholder="Select page size" />
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="10">10</Select.Item>
			<Select.Item value="20">20</Select.Item>
			<Select.Item value="30">30</Select.Item>
			<Select.Item value="40">40</Select.Item>
			<Select.Item value="50">50</Select.Item>
		</Select.Content>
	</Select.Root>
	<Button
		variant="outline"
		size="icon"
		onclick={() => table.firstPage()}
		disabled={!table.getCanPreviousPage()}
	>
		<Icons.ChevronsLeft />
	</Button>
	<Button
		variant="outline"
		size="icon"
		onclick={() => table.previousPage()}
		disabled={!table.getCanPreviousPage()}
	>
		<Icons.ChevronLeft />
	</Button>
	<Button
		variant="outline"
		size="icon"
		onclick={() => table.nextPage()}
		disabled={!table.getCanNextPage()}
	>
		<Icons.ChevronRight />
	</Button>
	<Button
		variant="outline"
		size="icon"
		onclick={() => table.lastPage()}
		disabled={!table.getCanNextPage()}
	>
		<Icons.ChevronsRight />
	</Button>
</div>
