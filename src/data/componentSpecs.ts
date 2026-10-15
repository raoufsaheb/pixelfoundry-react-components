export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentSpec {
  id: string;
  title: string;
  description: string;
  category: string;
  props: PropDef[];
  codeSnippet: string;
}

export const componentSpecs: ComponentSpec[] = [
  {
    id: 'accordion',
    title: 'Accordion',
    description: 'Vertically stacked interactive disclosure panels with keyboard navigation. Supports single and multi-expand modes.',
    category: 'Disclosure',
    props: [
      { name: 'items', type: 'AccordionItem[]', required: true, description: 'Array of accordion items with id, title, and content.' },
      { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Allow multiple panels to be open simultaneously.' },
      { name: 'defaultExpandedIds', type: 'string[]', default: '[]', description: 'IDs of items expanded on initial render.' },
      { name: 'onChange', type: '(ids: string[]) => void', description: 'Callback fired when expanded state changes.' },
      { name: 'className', type: 'string', description: 'Additional CSS classes for the container.' },
    ],
    codeSnippet: `import { Accordion } from '@pixelfoundry/react';

const items = [
  { id: 'q1', title: 'What is PixelFoundry?', content: 'A precision-crafted React component library.' },
  { id: 'q2', title: 'Is it accessible?', content: 'Yes — full ARIA compliance and keyboard navigation.' },
];

<Accordion items={items} allowMultiple />`,
  },
  {
    id: 'commandpalette',
    title: 'Command Palette',
    description: 'Fuzzy-search command launcher with keyboard navigation, grouped results, and shortcut display. Inspired by VS Code.',
    category: 'Navigation',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Controls visibility of the palette.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Callback when the palette is dismissed.' },
      { name: 'items', type: 'CommandItem[]', required: true, description: 'Commands to display, each with id, label, category, and onSelect.' },
      { name: 'placeholder', type: 'string', default: '"Search commands…"', description: 'Input placeholder text.' },
      { name: 'emptyMessage', type: 'string', default: '"No results found"', description: 'Message shown when no commands match.' },
    ],
    codeSnippet: `import { CommandPalette } from '@pixelfoundry/react';
import { useState } from 'react';

const [open, setOpen] = useState(false);
const commands = [
  { id: 'new', label: 'New File', category: 'File', shortcut: ['⌘', 'N'], onSelect: () => {} },
];

<CommandPalette isOpen={open} onClose={() => setOpen(false)} items={commands} />`,
  },
  {
    id: 'datatable',
    title: 'Data Table',
    description: 'Feature-rich generic table with multi-column sorting, row selection, search filtering, and pagination.',
    category: 'Data Display',
    props: [
      { name: 'data', type: 'T[]', required: true, description: 'Array of row data objects.' },
      { name: 'columns', type: 'ColumnDef<T>[]', required: true, description: 'Column definitions with key, header, and optional render.' },
      { name: 'keyField', type: 'keyof T', required: true, description: 'Field used as unique row identifier.' },
      { name: 'selectable', type: 'boolean', default: 'false', description: 'Enable row checkboxes for multi-select.' },
      { name: 'pageSize', type: 'number', default: '10', description: 'Number of rows per page.' },
      { name: 'searchable', type: 'boolean', default: 'false', description: 'Show search filter input.' },
    ],
    codeSnippet: `import { DataTable } from '@pixelfoundry/react';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
];
const data = [{ id: '1', name: 'Alice', role: 'Engineer' }];

<DataTable data={data} columns={columns} keyField="id" searchable />`,
  },
  {
    id: 'modal',
    title: 'Modal Dialog',
    description: 'Accessible modal overlay with focus trapping, scroll lock, and escape-key dismissal. Renders in a portal.',
    category: 'Overlay',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Controls modal visibility.' },
      { name: 'onClose', type: '() => void', required: true, description: 'Callback when modal is dismissed.' },
      { name: 'title', type: 'string', required: true, description: 'Dialog title displayed in the header.' },
      { name: 'description', type: 'string', description: 'Optional subtitle below the title.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Modal body content.' },
      { name: 'footer', type: 'ReactNode', description: 'Footer slot for action buttons.' },
      { name: 'size', type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: 'Controls max-width of the dialog.' },
      { name: 'closeOnBackdropClick', type: 'boolean', default: 'true', description: 'Dismiss when clicking outside.' },
    ],
    codeSnippet: `import { ModalDialog } from '@pixelfoundry/react';

<ModalDialog
  isOpen={isOpen}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  description="This cannot be undone."
  footer={<button onClick={() => setOpen(false)}>Confirm</button>}
>
  <p>Are you sure you want to proceed?</p>
</ModalDialog>`,
  },
  {
    id: 'toast',
    title: 'Toast Notifications',
    description: 'Ephemeral status messages with four semantic variants, auto-dismiss, and action buttons. Managed via context.',
    category: 'Feedback',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Toast headline.' },
      { name: 'description', type: 'string', description: 'Optional body text.' },
      { name: 'variant', type: '"info" | "success" | "warning" | "error"', default: '"info"', description: 'Visual style variant.' },
      { name: 'durationMs', type: 'number', default: '5000', description: 'Auto-dismiss delay in milliseconds.' },
      { name: 'action', type: '{ label: string; onClick: () => void }', description: 'Optional CTA button.' },
    ],
    codeSnippet: `import { ToastProvider, useToast } from '@pixelfoundry/react';

// Wrap app:
<ToastProvider><App /></ToastProvider>

// Inside any component:
const { addToast } = useToast();
addToast({ title: 'Saved!', variant: 'success', durationMs: 3000 });`,
  },
  {
    id: 'segmentedcontrol',
    title: 'Segmented Control',
    description: 'Radio-group styled as a pill selector with a smooth animated sliding indicator. Full keyboard navigation.',
    category: 'Input',
    props: [
      { name: 'options', type: 'SegmentedOption[]', required: true, description: 'Array of options with value, label, and optional icon.' },
      { name: 'value', type: 'string', required: true, description: 'Currently selected value.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Callback when selection changes.' },
      { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Control height and font size.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to fill container width.' },
    ],
    codeSnippet: `import { SegmentedControl } from '@pixelfoundry/react';

const [view, setView] = useState('grid');
const options = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'table', label: 'Table' },
];

<SegmentedControl options={options} value={view} onChange={setView} />`,
  },
  {
    id: 'taginput',
    title: 'Tag Input',
    description: 'Tokenized multi-value text input. Press Enter or comma to commit tags, Backspace to remove, with duplicate prevention.',
    category: 'Input',
    props: [
      { name: 'tags', type: 'string[]', required: true, description: 'Controlled array of current tags.' },
      { name: 'onChange', type: '(tags: string[]) => void', required: true, description: 'Callback when tag list changes.' },
      { name: 'placeholder', type: 'string', default: '"Add tag…"', description: 'Input placeholder shown when empty.' },
      { name: 'maxTags', type: 'number', description: 'Maximum number of tags allowed.' },
      { name: 'allowDuplicates', type: 'boolean', default: 'false', description: 'Whether to allow duplicate tag values.' },
    ],
    codeSnippet: `import { TagInput } from '@pixelfoundry/react';

const [tags, setTags] = useState(['react', 'typescript']);

<TagInput tags={tags} onChange={setTags} maxTags={10} label="Technologies" />`,
  },
];
