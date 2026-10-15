import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '../src/components/primitives/Accordion/Accordion';
import type { AccordionItemData } from '../src/components/primitives/Accordion/Accordion.types';

const items: AccordionItemData[] = [
  { id: 'a', title: 'Alpha', content: 'Alpha content' },
  { id: 'b', title: 'Beta', content: 'Beta content' },
  { id: 'c', title: 'Gamma', content: 'Gamma content', disabled: true },
];

describe('Accordion', () => {
  it('renders all item titles', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText('Alpha content')).not.toBeVisible();
  });

  it('expands item on click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByText('Alpha'));
    expect(screen.getByText('Alpha content')).toBeVisible();
  });

  it('collapses an expanded item when clicked again', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultExpandedIds={['a']} />);
    expect(screen.getByText('Alpha content')).toBeVisible();
    await user.click(screen.getByText('Alpha'));
    expect(screen.queryByText('Alpha content')).not.toBeVisible();
  });

  it('expands only one item at a time in single mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByText('Alpha'));
    await user.click(screen.getByText('Beta'));
    expect(screen.queryByText('Alpha content')).not.toBeVisible();
    expect(screen.getByText('Beta content')).toBeVisible();
  });

  it('allows multiple expanded in allowMultiple mode', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} allowMultiple />);
    await user.click(screen.getByText('Alpha'));
    await user.click(screen.getByText('Beta'));
    expect(screen.getByText('Alpha content')).toBeVisible();
    expect(screen.getByText('Beta content')).toBeVisible();
  });

  it('disabled item cannot be expanded', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const gammaBtn = screen.getByRole('button', { name: /Gamma/i });
    expect(gammaBtn).toBeDisabled();
    await user.click(gammaBtn);
    expect(screen.queryByText('Gamma content')).not.toBeVisible();
  });

  it('renders with defaultExpandedIds', () => {
    render(<Accordion items={items} defaultExpandedIds={['b']} />);
    expect(screen.getByText('Beta content')).toBeVisible();
  });

  it('calls onChange with updated ids', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Accordion items={items} onChange={onChange} />);
    await user.click(screen.getByText('Alpha'));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('sets aria-expanded correctly', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const alphaBtn = screen.getByRole('button', { name: /Alpha/i });
    expect(alphaBtn).toHaveAttribute('aria-expanded', 'false');
    await user.click(alphaBtn);
    expect(alphaBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
