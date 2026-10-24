import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BookingModal } from '../BookingModal.tsx';

describe('BookingModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<BookingModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content and form when isOpen is true', () => {
    render(<BookingModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/15-minute strategy call/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Alex Morgan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
  });

  it('calls onClose when close icon button is clicked', () => {
    const handleClose = vi.fn();
    render(<BookingModal isOpen={true} onClose={handleClose} />);
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
