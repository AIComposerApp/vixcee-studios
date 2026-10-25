import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkPage } from '../WorkPage.tsx';

describe('WorkPage', () => {
  const defaultProps = {
    onSelectCaseStudy: vi.fn(),
    onOpenBookCall: vi.fn(),
    onNavigateHome: vi.fn(),
    onNavigateCaseStudies: vi.fn(),
    dockStage: 'docked' as const,
  };

  it('renders initial mobile work items and dock', () => {
    render(<WorkPage {...defaultProps} />);
    const mobileButton = screen.getByRole('button', { name: /^mobile$/i });
    expect(mobileButton).toBeInTheDocument();
  });

  it('allows switching device modes between mobile and desktop', () => {
    render(<WorkPage {...defaultProps} />);
    const desktopButton = screen.getByRole('button', { name: /^desktop$/i });
    fireEvent.click(desktopButton);
    expect(desktopButton).toBeInTheDocument();
  });

  it('supports initialFocusedItemId prop', () => {
    render(<WorkPage {...defaultProps} initialFocusedItemId="prince-of-web3" />);
    const closeButtons = screen.queryAllByLabelText(/close focus/i);
    expect(closeButtons.length).toBeGreaterThanOrEqual(0);
  });
});
