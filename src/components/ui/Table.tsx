import { useState, useMemo } from 'react';
import type { SortingState, ColumnDef } from '@tanstack/react-table';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { IconChevronUp, IconChevronDown, IconSelector, IconFilter, IconDownload, IconSearch } from '@tabler/icons-react';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  exportable?: boolean;
  filterable?: boolean;
  onExport?: () => void;
  onFilter?: () => void;
  pageSize?: number;
  pageSizeOptions?: number[];
}

export default function Table<T>({
  data,
  columns,
  title,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  exportable = true,
  filterable = true,
  onExport,
  onFilter,
  pageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const paginationRange = useMemo(() => {
    const totalPages = pageCount;
    const current = pageIndex + 1;
    const delta = 1;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  }, [pageIndex, pageCount]);

  const SortIcon = ({ isSorted }: { isSorted: false | 'asc' | 'desc' }) => {
    if (!isSorted) return <IconSelector size={16} className="text-gray-400" />;
    return isSorted === 'asc' 
      ? <IconChevronUp size={16} className="text-gray-700" />
      : <IconChevronDown size={16} className="text-gray-700" />;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
        {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Mostrar</span>
            <select
              value={currentPageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          {filterable && (
            <button
              onClick={onFilter}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <IconFilter size={18} />
              <span>Filter</span>
            </button>
          )}

          {/* Export Button */}
          {exportable && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <IconDownload size={18} />
              <span>Export</span>
            </button>
          )}

          {/* Search */}
          {searchable && (
            <div className="relative">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-gray-100">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <SortIcon isSorted={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-xs text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconChevronUp size={16} className="-rotate-90" />
          <span>Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {paginationRange.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => table.setPageIndex(Number(page) - 1)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  pageIndex + 1 === page
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Siguiente</span>
          <IconChevronUp size={16} className="rotate-90" />
        </button>
      </div>
    </div>
  );
}