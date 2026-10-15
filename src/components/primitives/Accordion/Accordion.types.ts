import type { ReactNode } from 'react';

export interface AccordionItemData {
  id: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  onChange?: (expandedIds: string[]) => void;
  className?: string;
}
