import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Header } from '../../Header.tsx';

describe('Header Component', () => {
  it('renders brand identity and primary navigation links', () => {
    render(
      <Header
        onOpenStart={vi.fn()}
        onOpenPrompts={vi.fn()}
        dockStage="docked"
      />
    );

    expect(screen.getByText(/vixcee studios/i)).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Case studies')).toBeInTheDocument();
    expect(screen.getByText('Prompts')).toBeInTheDocument();
  });

  it('triggers onOpenStart when Prompts button is clicked', () => {
    const handleOpenStart = vi.fn();
    render(
      <Header
        onOpenStart={handleOpenStart}
        onOpenPrompts={vi.fn()}
        dockStage="docked"
      />
    );

    const promptsBtn = screen.getByRole('button', { name: /^prompts$/i });
    fireEvent.click(promptsBtn);
    expect(handleOpenStart).toHaveBeenCalledTimes(1);
  });

  it('triggers onNavigateCaseStudies when Case studies link is clicked', () => {
    const handleCaseStudies = vi.fn();
    render(
      <Header
        onOpenStart={vi.fn()}
        onOpenPrompts={vi.fn()}
        onNavigateCaseStudies={handleCaseStudies}
        dockStage="docked"
      />
    );

    const caseStudiesLink = screen.getByRole('link', { name: /^case studies$/i });
    fireEvent.click(caseStudiesLink);
    expect(handleCaseStudies).toHaveBeenCalledTimes(1);
  });
});
