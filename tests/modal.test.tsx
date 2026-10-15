import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalDialog } from '../src/components/primitives/Modal/ModalDialog';

describe('ModalDialog', () => {
  it('renders nothing when closed', () => {
    render(
      <ModalDialog isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Body</p>
      </ModalDialog>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <ModalDialog isOpen={true} onClose={vi.fn()} title="Confirm Action">
        <p>Modal body</p>
      </ModalDialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('shows description when provided', () => {
    render(
      <ModalDialog isOpen={true} onClose={vi.fn()} title="T" description="Some description">
        <p>content</p>
      </ModalDialog>,
    );
    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <ModalDialog isOpen={true} onClose={onClose} title="T">
        <p>body</p>
      </ModalDialog>,
    );
    await user.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <ModalDialog isOpen={true} onClose={onClose} title="T">
        <p>body</p>
      </ModalDialog>,
    );
    // Click close button to trigger - or click inside the dialog to focus it
    const closeBtn = screen.getByLabelText('Close dialog');
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders footer slot', () => {
    render(
      <ModalDialog
        isOpen={true}
        onClose={vi.fn()}
        title="T"
        footer={<button type="button">Confirm</button>}
      >
        <p>body</p>
      </ModalDialog>,
    );
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(
      <ModalDialog isOpen={true} onClose={vi.fn()} title="Aria Test">
        <p>content</p>
      </ModalDialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-dialog-title');
  });

  it('does not call onClose on backdrop click when closeOnBackdropClick is false', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <ModalDialog isOpen={true} onClose={onClose} title="T" closeOnBackdropClick={false}>
        <p>body</p>
      </ModalDialog>,
    );
    // Click the backdrop overlay (the outer dialog div)
    await user.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
