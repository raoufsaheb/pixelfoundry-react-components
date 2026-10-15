import type { ReactNode } from 'react';

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  shortcut?: string[];
  icon?: ReactNode;
  onSelect: () => void;
  keywords?: string[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
}
