import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../src/components/primitives/DataTable/DataTable';
import type { ColumnDef } from '../src/components/primitives/DataTable/DataTable.types';

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
  score: number;
}

const data: Row[] = [
  { id: '1', name: 'Alice', score: 95 },
  { id: '2', name: 'Bob', score: 72 },
  { id: '3', name: 'Charlie', score: 88 },
  { id: '4', name: 'Diana', score: 61 },
  { id: '5', name: 'Eve', score: 99 },
];

const columns: ColumnDef<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable data={data} columns={columns} keyField="id" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('renders all rows', () => {
    render(<DataTable data={data} columns={columns} keyField="id" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('filters rows on search input', async () => {
    const user = userEvent.setup();
    render(<DataTable data={data} columns={columns} keyField="id" searchable />);
    await user.type(screen.getByPlaceholderText(/search/i), 'alice');
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('shows empty message when search has no matches', async () => {
    const user = userEvent.setup();
    render(<DataTable data={data} columns={columns} keyField="id" searchable emptyMessage="No rows" />);
    await user.type(screen.getByPlaceholderText(/search/i), 'zzzz');
    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('paginates data correctly', () => {
    render(<DataTable data={data} columns={columns} keyField="id" pageSize={2} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
  });

  it('shows checkboxes when selectable', () => {
    render(<DataTable data={data} columns={columns} keyField="id" selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 1 select-all + 5 row checkboxes = 6
    expect(checkboxes.length).toBe(6);
  });

  it('selects a row when checkbox clicked', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTable
        data={data}
        columns={columns}
        keyField="id"
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    await user.click(rowCheckboxes[0]);
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('renders custom cell via render function', () => {
    const customColumns: ColumnDef<Row>[] = [
      ...columns,
      {
        key: 'scoreBadge',
        header: 'Badge',
        render: (row) => <span data-testid="badge">{row.score >= 90 ? 'A' : 'B'}</span>,
      },
    ];
    render(<DataTable data={data} columns={customColumns} keyField="id" />);
    const badges = screen.getAllByTestId('badge');
    expect(badges.length).toBeGreaterThan(0);
  });
});
