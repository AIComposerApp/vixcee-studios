import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StepProject, StepProjectProps } from '../StepProject.tsx';

describe('StepProject Component', () => {
  const defaultProps: StepProjectProps = {
    estimatedBudget: '< $5k',
    setEstimatedBudget: vi.fn(),
    additionalInterests: ['Branding'],
    setAdditionalInterests: vi.fn(),
    projectNotes: '',
    setProjectNotes: vi.fn(),
    foreseenChallenges: '',
    setForeseenChallenges: vi.fn(),
    errorMsg: '',
    onPrev: vi.fn(),
    onNext: vi.fn(),
  };

  it('renders budget tier options and selects budget', () => {
    render(<StepProject {...defaultProps} />);

    expect(screen.getByText('< $5k')).toBeInTheDocument();
    expect(screen.getByText('$5k – $10k')).toBeInTheDocument();
    expect(screen.getByText('$10k – $25k')).toBeInTheDocument();
    expect(screen.getByText('$25k+')).toBeInTheDocument();

    const tenTier = screen.getByText('$5k – $10k');
    fireEvent.click(tenTier);
    expect(defaultProps.setEstimatedBudget).toHaveBeenCalledWith('$5k – $10k');
  });

  it('navigates between steps using Back and Next buttons', () => {
    render(<StepProject {...defaultProps} />);

    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(defaultProps.onPrev).toHaveBeenCalled();

    const nextBtn = screen.getByText('Next: Pick Time');
    fireEvent.click(nextBtn);
    expect(defaultProps.onNext).toHaveBeenCalled();
  });
});
