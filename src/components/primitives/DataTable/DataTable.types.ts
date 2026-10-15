import type { ReactNode } from 'react';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyField: keyof T;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pageSize?: number;
  searchPlaceholder?: string;
  searchable?: boolean;
  emptyMessage?: string;
  className?: string;
}
