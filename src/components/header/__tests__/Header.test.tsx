import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('triggers onNavigateCaseStudies when Case studies link is clicked on desktop', () => {
    const handleCaseStudies = vi.fn();
    render(
      <Header
        onOpenStart={vi.fn()}
        onOpenPrompts={vi.fn()}
        onNavigateCaseStudies={handleCaseStudies}
        dockStage="docked"
      />
    );

    const caseStudiesLinks = screen.getAllByRole('link', { name: /case studies/i });
    fireEvent.click(caseStudiesLinks[0]);
    expect(handleCaseStudies).toHaveBeenCalledTimes(1);
  });

  it('opens mobile drawer and triggers navigation when Work, Case studies, and Prompts are clicked', () => {
    const handleWork = vi.fn();
    const handleCaseStudies = vi.fn();
    const handlePrompts = vi.fn();

    render(
      <Header
        onOpenStart={vi.fn()}
        onOpenPrompts={handlePrompts}
        onNavigateWork={handleWork}
        onNavigateCaseStudies={handleCaseStudies}
        dockStage="docked"
      />
    );

    // Open mobile menu
    const hamburgerBtn = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburgerBtn);

    // Verify mobile drawer dialog is in the DOM
    const mobilePanel = screen.getByRole('dialog', { name: /mobile navigation menu/i });
    expect(mobilePanel).toBeInTheDocument();

    // Click Work link in mobile menu
    const workLinks = screen.getAllByRole('link', { name: /^work/i });
    const mobileWorkLink = workLinks[workLinks.length - 1];
    fireEvent.click(mobileWorkLink);
    expect(handleWork).toHaveBeenCalledTimes(1);

    // Click Case studies link in mobile menu
    const caseStudiesLinks = screen.getAllByRole('link', { name: /case studies/i });
    const mobileCaseStudiesLink = caseStudiesLinks[caseStudiesLinks.length - 1];
    fireEvent.click(mobileCaseStudiesLink);
    expect(handleCaseStudies).toHaveBeenCalledTimes(1);

    // Click AI Coding Prompts link in mobile menu
    const promptsLinks = screen.getAllByRole('link', { name: /ai coding prompts/i });
    const mobilePromptsLink = promptsLinks[promptsLinks.length - 1];
    fireEvent.click(mobilePromptsLink);
    expect(handlePrompts).toHaveBeenCalledTimes(1);
  });
});
