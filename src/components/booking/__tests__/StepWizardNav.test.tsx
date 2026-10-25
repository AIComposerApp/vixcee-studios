import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepWizardNav } from '../StepWizardNav.tsx';

describe('StepWizardNav', () => {
  it('renders step labels and indicator', () => {
    render(
      <StepWizardNav
        currentStep={1}
        onSelectStep={vi.fn()}
        canAdvanceToStep={() => true}
      />
    );
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('triggers onSelectStep when step button is clicked and allowed', () => {
    const handleSelect = vi.fn();
    render(
      <StepWizardNav
        currentStep={1}
        onSelectStep={handleSelect}
        canAdvanceToStep={(step) => step === 2}
      />
    );

    fireEvent.click(screen.getByText('Contact'));
    expect(handleSelect).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Project'));
    expect(handleSelect).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText('Schedule'));
    // Step 3 disallowed by canAdvanceToStep
    expect(handleSelect).not.toHaveBeenCalledWith(3);
  });

  it('applies completed styles when on step 3', () => {
    render(
      <StepWizardNav
        currentStep={3}
        onSelectStep={vi.fn()}
        canAdvanceToStep={() => true}
      />
    );
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
  });
});
