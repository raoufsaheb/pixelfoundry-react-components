import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DataTableProps, SortDirection } from './DataTable.types';

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  selectable = false,
  selectedIds: externalSelectedIds,
  onSelectionChange,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search table records...',
  emptyMessage = 'No matching records found.',
  className = '',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);

  const selectAllRef = useRef<HTMLInputElement>(null);

  const selectedIds = externalSelectedIds ?? internalSelectedIds;

  const handleSelectionUpdate = (newIds: string[]) => {
    if (onSelectionChange) {
      onSelectionChange(newIds);
    } else {
      setInternalSelectedIds(newIds);
    }
  };

  // Filtered data
  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lower = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        val !== null && val !== undefined ? String(val).toLowerCase().includes(lower) : false
      )
    );
  }, [data, query]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginated data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Update indeterminate state of select-all checkbox
  useEffect(() => {
    if (!selectAllRef.current) return;
    const currentPageIds = paginatedData.map((row) => String(row[keyField]));
    const selectedOnCurrentPage = currentPageIds.filter((id) => selectedIds.includes(id));

    if (selectedOnCurrentPage.length === 0) {
      selectAllRef.current.checked = false;
      selectAllRef.current.indeterminate = false;
    } else if (selectedOnCurrentPage.length === currentPageIds.length) {
      selectAllRef.current.checked = true;
      selectAllRef.current.indeterminate = false;
    } else {
      selectAllRef.current.checked = false;
      selectAllRef.current.indeterminate = true;
    }
  }, [paginatedData, selectedIds, keyField]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortKey(null);
      setSortDirection(null);
    }
  };

  const handleSelectAllOnPage = (checked: boolean) => {
    const currentPageIds = paginatedData.map((row) => String(row[keyField]));
    if (checked) {
      const next = Array.from(new Set([...selectedIds, ...currentPageIds]));
      handleSelectionUpdate(next);
    } else {
      const next = selectedIds.filter((id) => !currentPageIds.includes(id));
      handleSelectionUpdate(next);
    }
  };

  const toggleRowSelection = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    handleSelectionUpdate(next);
  };

  return (
    <div className={`border border-[#22252A] rounded-2xl bg-[#141618] overflow-hidden flex flex-col ${className}`}>
      {/* Table Toolbar */}
      {searchable && (
        <div className="p-4 border-b border-[#22252A] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0C0D0E] border border-[#22252A] text-xs text-[#F3F4F6] placeholder:text-[#5E656E] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {selectable && (
            <span className="text-xs font-mono text-[#9CA3AF]">
              {selectedIds.length} of {data.length} selected
            </span>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0C0D0E]/60 text-[#9CA3AF] border-b border-[#22252A] uppercase font-mono tracking-wider text-[10px]">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all rows on current page"
                    onChange={(e) => handleSelectAllOnPage(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#141618] border-[#22252A] accent-[#3B82F6] cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => {
                const colKey = String(col.key);
                const isSorted = sortKey === colKey;

                return (
                  <th
                    key={colKey}
                    style={{ width: col.width }}
                    aria-sort={
                      isSorted
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : col.sortable
                        ? 'none'
                        : undefined
                    }
                    className="px-4 py-3 font-semibold"
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => toggleSort(colKey)}
                        className="flex items-center gap-1.5 hover:text-[#F3F4F6] transition-colors focus:outline-none focus-visible:text-[#3B82F6]"
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#3B82F6]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#3B82F6]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#22252A]/50 text-[#F3F4F6]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-[#5E656E]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rowId = String(row[keyField]);
                const isSelected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    aria-selected={isSelected}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-[#1C1F23]/80'
                        : 'hover:bg-[#1C1F23]/40'
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          aria-label={`Select row ${rowId}`}
                          onChange={() => toggleRowSelection(rowId)}
                          className="w-3.5 h-3.5 rounded bg-[#141618] border-[#22252A] accent-[#3B82F6] cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-xs">
                        {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#22252A] bg-[#0C0D0E]/40 flex items-center justify-between text-xs text-[#9CA3AF]">
        <span>
          Showing {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-lg border border-[#22252A] bg-[#141618] text-[#9CA3AF] hover:text-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-[#F3F4F6] px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg border border-[#22252A] bg-[#141618] text-[#9CA3AF] hover:text-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
