import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Table2, Bell, Layers,
  Zap, Shield, ChevronRight,
} from 'lucide-react';

import { Header } from './components/layout/Header';
import { Sidebar, MobileMenuButton } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ComponentShowcase } from './components/playground/ComponentShowcase';

// Primitives
import { Accordion } from './components/primitives/Accordion/Accordion';
import { CommandPalette } from './components/primitives/CommandPalette/CommandPalette';
import { DataTable } from './components/primitives/DataTable/DataTable';
import type { ColumnDef } from './components/primitives/DataTable/DataTable.types';
import { ModalDialog } from './components/primitives/Modal/ModalDialog';
import { ToastViewport } from './components/primitives/Toast/Toast';
import { useToast } from './components/primitives/Toast/ToastContext';
import { SegmentedControl } from './components/primitives/SegmentedControl/SegmentedControl';
import { TagInput } from './components/primitives/TagInput/TagInput';

import { componentSpecs } from './data/componentSpecs';

// ── Sample data for DataTable preview ────────────────────────
interface TeamMember extends Record<string, unknown> {
  id: string;
  name: string;
  role: string;
  team: string;
  status: string;
}

const TEAM_DATA: TeamMember[] = [
  { id: '1', name: 'Alice Hoffman', role: 'Staff Engineer', team: 'Platform', status: 'Active' },
  { id: '2', name: 'Ben Carter', role: 'Product Designer', team: 'Design', status: 'Active' },
  { id: '3', name: 'Clara Ng', role: 'Data Scientist', team: 'ML', status: 'On leave' },
  { id: '4', name: 'Diego Reyes', role: 'Frontend Engineer', team: 'Web', status: 'Active' },
  { id: '5', name: 'Eva Johansson', role: 'Engineering Manager', team: 'Platform', status: 'Active' },
  { id: '6', name: 'Frank Liu', role: 'Backend Engineer', team: 'API', status: 'Inactive' },
  { id: '7', name: 'Grace Kim', role: 'UX Researcher', team: 'Design', status: 'Active' },
];

const TABLE_COLUMNS: ColumnDef<TeamMember>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '200px' },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'team', header: 'Team', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (row: TeamMember) => {
      const colours: Record<string, string> = {
        Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        Inactive: 'bg-red-500/15 text-red-400 border-red-500/30',
        'On leave': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      };
      return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${colours[row.status] ?? ''}`}>
          {row.status}
        </span>
      );
    },
  },
];

// ── Component preview factories ───────────────────────────────
function AccordionPreview() {
  return (
    <div className="w-full max-w-lg">
      <Accordion
        defaultExpandedIds={['q1']}
        items={[
          { id: 'q1', title: 'What is PixelFoundry?', content: 'A precision-crafted React component library built with Swiss Modernist sensibility.' },
          { id: 'q2', title: 'Is it accessible?', content: 'Full ARIA compliance with keyboard navigation, focus management, and screen reader support.' },
          { id: 'q3', title: 'What are the dependencies?', content: 'React 19, TypeScript 5.8, Tailwind CSS v4, and Lucide React for icons.' },
        ]}
      />
    </div>
  );
}

function CommandPalettePreview() {
  const [open, setOpen] = useState(false);
  const { addToast } = useToast();

  const commands = [
    { id: 'accordion', label: 'View Accordion', category: 'Navigation', icon: <Layers className="w-4 h-4" />, shortcut: ['⌘', '1'], onSelect: () => addToast({ title: 'Accordion selected', variant: 'info' }) },
    { id: 'datatable', label: 'View Data Table', category: 'Navigation', icon: <Table2 className="w-4 h-4" />, shortcut: ['⌘', '2'], onSelect: () => addToast({ title: 'DataTable selected', variant: 'info' }) },
    { id: 'toast', label: 'Fire Test Toast', category: 'Actions', icon: <Bell className="w-4 h-4" />, shortcut: ['⌘', 'T'], onSelect: () => addToast({ title: 'Toast fired!', description: 'Command executed successfully.', variant: 'success' }) },
    { id: 'docs', label: 'Open Documentation', category: 'Actions', icon: <FileText className="w-4 h-4" />, onSelect: () => addToast({ title: 'Opening docs…', variant: 'info' }) },
    { id: 'shortcut', label: 'View Keyboard Shortcuts', category: 'Help', icon: <Zap className="w-4 h-4" />, onSelect: () => addToast({ title: 'Shortcuts', description: '⌘K to open, ESC to close', variant: 'info' }) },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-mono font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Open Command Palette
        <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">⌘K</kbd>
      </button>
      <p className="text-xs text-[#6B7280] font-mono">Press ⌘K or click to open</p>
      <CommandPalette isOpen={open} onClose={() => setOpen(false)} items={commands} />
    </div>
  );
}

function DataTablePreview() {
  return (
    <div className="w-full">
      <DataTable
        data={TEAM_DATA}
        columns={TABLE_COLUMNS}
        keyField="id"
        selectable
        searchable
        pageSize={5}
      />
    </div>
  );
}

function ModalPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-[#1C1F23] border border-[#2A2D33] hover:border-[#3B82F6]/50 text-sm font-mono text-[#F3F4F6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
      >
        Open Modal Dialog
      </button>
      <ModalDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirm Deployment"
        description="Review the changes before pushing to production."
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-mono text-[#9CA3AF] hover:text-white border border-[#2A2D33] hover:border-[#3B82F6]/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-mono text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors"
            >
              Deploy Now
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-sm text-[#9CA3AF]">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0C0D0E] border border-[#22252A]">
            <Shield className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[#F3F4F6] text-xs mb-0.5">Production Environment</p>
              <p className="text-xs">This action will trigger a rolling deployment to 3 regions.</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed">
            Commit <code className="font-mono text-[#93C5FD]">a1b2c3d</code> will be promoted from staging.
            Estimated rollout: 3–5 minutes.
          </p>
        </div>
      </ModalDialog>
    </div>
  );
}

function ToastPreview() {
  const { addToast } = useToast();
  const variants = [
    { label: 'Info', variant: 'info' as const, desc: 'Deployment queued for review.' },
    { label: 'Success', variant: 'success' as const, desc: 'Component published to registry.' },
    { label: 'Warning', variant: 'warning' as const, desc: 'API rate limit approaching.' },
    { label: 'Error', variant: 'error' as const, desc: 'Build failed. See logs for details.' },
  ];
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {variants.map((v) => (
        <button
          key={v.variant}
          type="button"
          onClick={() => addToast({ title: `${v.label} Toast`, description: v.desc, variant: v.variant })}
          className="px-3 py-2 rounded-xl bg-[#1C1F23] border border-[#2A2D33] hover:border-[#3B82F6]/40 text-xs font-mono text-[#D1D5DB] hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

function SegmentedPreview() {
  const [view, setView] = useState('grid');
  const [size, setSize] = useState('md');
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <SegmentedControl
        options={[
          { value: 'grid', label: 'Grid', icon: <Layers className="w-3.5 h-3.5" /> },
          { value: 'list', label: 'List', icon: <FileText className="w-3.5 h-3.5" /> },
          { value: 'table', label: 'Table', icon: <Table2 className="w-3.5 h-3.5" /> },
        ]}
        value={view}
        onChange={setView}
        fullWidth
      />
      <SegmentedControl
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        value={size}
        onChange={setSize}
        fullWidth
      />
      <p className="text-xs font-mono text-[#6B7280]">
        view: <span className="text-[#93C5FD]">{view}</span> · size: <span className="text-[#93C5FD]">{size}</span>
      </p>
    </div>
  );
}

function TagInputPreview() {
  const [tags, setTags] = useState(['react', 'typescript', 'tailwind']);
  return (
    <div className="w-full max-w-md">
      <TagInput
        tags={tags}
        onChange={setTags}
        label="Technologies"
        maxTags={10}
        placeholder="Add technology…"
      />
    </div>
  );
}

// ── Preview map ───────────────────────────────────────────────
const PREVIEWS: Record<string, React.ReactNode> = {
  accordion:        <AccordionPreview />,
  commandpalette:   <CommandPalettePreview />,
  datatable:        <DataTablePreview />,
  modal:            <ModalPreview />,
  toast:            <ToastPreview />,
  segmentedcontrol: <SegmentedPreview />,
  taginput:         <TagInputPreview />,
};

// ── App ───────────────────────────────────────────────────────
export function App() {
  const [activeId, setActiveId] = useState(componentSpecs[0].id);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSpec = componentSpecs.find((s) => s.id === activeId) ?? componentSpecs[0];

  // Global ⌘K shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCmdOpen((v) => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const commandItems = componentSpecs.map((spec) => ({
    id: spec.id,
    label: spec.title,
    category: spec.category,
    keywords: [spec.description],
    onSelect: () => setActiveId(spec.id),
  }));

  return (
    <div className="min-h-dvh bg-[#0C0D0E] flex flex-col">
      {/* Sidebar */}
      <Sidebar
        specs={componentSpecs}
        activeId={activeId}
        onSelect={setActiveId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Header */}
      <Header
        onOpenCommandPalette={() => setCmdOpen(true)}
        mobileMenuButton={<MobileMenuButton onClick={() => setSidebarOpen(true)} />}
      />

      {/* Main content area */}
      <main
        id="main-content"
        className="flex-1 lg:ml-64 pt-16"
      >
        {/* Hero banner (shown only on first load) */}
        {activeId === componentSpecs[0].id && (
          <div className="border-b border-[#22252A] bg-gradient-to-b from-[#3B82F6]/5 to-transparent">
            <div className="px-6 sm:px-10 py-10 max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono font-semibold text-[#3B82F6] uppercase tracking-widest border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2.5 py-1 rounded-full">
                  Component Library
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight mb-3">
                PixelFoundry
              </h1>
              <p className="text-base text-[#9CA3AF] leading-relaxed max-w-2xl mb-6">
                Seven precision-crafted, fully accessible React primitives. Built with Swiss Modernist sensibility — every pixel intentional, every interaction considered.
              </p>
              <div className="flex flex-wrap gap-3">
                {['React 19', 'TypeScript 5.8', 'Tailwind CSS v4', 'WCAG 2.1 AA'].map((badge) => (
                  <span key={badge} className="text-xs font-mono px-3 py-1 rounded-lg bg-[#1C1F23] border border-[#2A2D33] text-[#9CA3AF]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Component showcase */}
        <div className="px-6 sm:px-10 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#4B5563] mb-8">
            <span>Components</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#9CA3AF]">{activeSpec.title}</span>
          </div>

          <ComponentShowcase
            spec={activeSpec}
            preview={PREVIEWS[activeId]}
          />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#22252A]">
            <button
              type="button"
              disabled={componentSpecs.indexOf(activeSpec) === 0}
              onClick={() => {
                const idx = componentSpecs.indexOf(activeSpec);
                if (idx > 0) setActiveId(componentSpecs[idx - 1].id);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono text-[#9CA3AF] border border-[#22252A] hover:border-[#3B82F6]/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
            >
              ← Previous
            </button>
            <span className="text-xs font-mono text-[#4B5563]">
              {componentSpecs.indexOf(activeSpec) + 1} / {componentSpecs.length}
            </span>
            <button
              type="button"
              disabled={componentSpecs.indexOf(activeSpec) === componentSpecs.length - 1}
              onClick={() => {
                const idx = componentSpecs.indexOf(activeSpec);
                if (idx < componentSpecs.length - 1) setActiveId(componentSpecs[idx + 1].id);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono text-[#9CA3AF] border border-[#22252A] hover:border-[#3B82F6]/40 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6]"
            >
              Next →
            </button>
          </div>
        </div>

        <Footer />
      </main>

      {/* Global command palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        items={commandItems}
        placeholder="Search components…"
      />

      {/* Toast viewport */}
      <ToastViewport />
    </div>
  );
}
