import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '../src/components/primitives/CommandPalette/CommandPalette';
import type { CommandItem } from '../src/components/primitives/CommandPalette/CommandPalette.types';

const makeItems = (): CommandItem[] => [
  { id: 'new', label: 'New File', category: 'File', shortcut: ['⌘', 'N'], onSelect: vi.fn() },
  { id: 'open', label: 'Open Folder', category: 'File', onSelect: vi.fn() },
  { id: 'run', label: 'Run Tests', category: 'Tools', onSelect: vi.fn() },
];

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette isOpen={false} onClose={vi.fn()} items={makeItems()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<CommandPalette isOpen={true} onClose={vi.fn()} items={makeItems()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('lists all items when query is empty', () => {
    render(<CommandPalette isOpen={true} onClose={vi.fn()} items={makeItems()} />);
    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('Open Folder')).toBeInTheDocument();
    expect(screen.getByText('Run Tests')).toBeInTheDocument();
  });

  it('filters items by query', async () => {
    const user = userEvent.setup();
    render(<CommandPalette isOpen={true} onClose={vi.fn()} items={makeItems()} />);
    await user.type(screen.getByRole('combobox'), 'test');
    expect(screen.getByText('Run Tests')).toBeInTheDocument();
    expect(screen.queryByText('New File')).not.toBeInTheDocument();
  });

  it('shows empty message when no results', async () => {
    const user = userEvent.setup();
    render(<CommandPalette isOpen={true} onClose={vi.fn()} items={makeItems()} emptyMessage="Nothing found" />);
    await user.type(screen.getByRole('combobox'), 'xyzzy');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<CommandPalette isOpen={true} onClose={onClose} items={makeItems()} />);
    // Focus the input first so the keydown handler fires on the parent container
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSelect and onClose when item is clicked', async () => {
    const onClose = vi.fn();
    const items = makeItems();
    const user = userEvent.setup();
    render(<CommandPalette isOpen={true} onClose={onClose} items={items} />);
    await user.click(screen.getByText('New File'));
    expect(items[0].onSelect).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('displays category group headers', () => {
    render(<CommandPalette isOpen={true} onClose={vi.fn()} items={makeItems()} />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('displays shortcut keys', () => {
    render(<CommandPalette isOpen={true} onClose={vi.fn()} items={makeItems()} />);
    expect(screen.getByText('⌘')).toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
  });
});
