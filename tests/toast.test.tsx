import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../src/components/primitives/Toast/ToastContext';
import { ToastViewport } from '../src/components/primitives/Toast/Toast';

// Helper: render ToastViewport inside ToastProvider and expose addToast via a trigger button
function TestHarness({ onToastAdded }: { onToastAdded?: (id: string) => void }) {
  const { addToast } = useToast();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const id = addToast({ title: 'Hello Toast', variant: 'info' });
          onToastAdded?.(id);
        }}
      >
        Add Info Toast
      </button>
      <button
        type="button"
        onClick={() => addToast({ title: 'Success!', variant: 'success', description: 'All done.' })}
      >
        Add Success Toast
      </button>
      <button
        type="button"
        onClick={() => addToast({ title: 'Oops', variant: 'error', action: { label: 'Retry', onClick: vi.fn() } })}
      >
        Add Error Toast
      </button>
      <ToastViewport />
    </div>
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('Toast', () => {
  it('shows a toast when addToast is called', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestHarness />);
    await user.click(screen.getByText('Add Info Toast'));
    expect(screen.getByText('Hello Toast')).toBeInTheDocument();
  });

  it('shows success toast with description', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestHarness />);
    await user.click(screen.getByText('Add Success Toast'));
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('All done.')).toBeInTheDocument();
  });

  it('shows error toast with action button', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestHarness />);
    await user.click(screen.getByText('Add Error Toast'));
    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('dismisses a toast when X button clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestHarness />);
    await user.click(screen.getByText('Add Info Toast'));
    expect(screen.getByText('Hello Toast')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Dismiss notification'));
    expect(screen.queryByText('Hello Toast')).not.toBeInTheDocument();
  });

  it('can stack multiple toasts', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TestHarness />);
    await user.click(screen.getByText('Add Info Toast'));
    await user.click(screen.getByText('Add Success Toast'));
    expect(screen.getByText('Hello Toast')).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('useToast throws outside provider', () => {
    const BrokenComponent = () => {
      useToast();
      return null;
    };
    // Suppress expected error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BrokenComponent />)).toThrow('useToast must be used within a ToastProvider');
    consoleSpy.mockRestore();
  });

  it('ToastViewport has correct aria attributes', () => {
    renderWithProvider(<TestHarness />);
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveAttribute('aria-live', 'polite');
  });
});
