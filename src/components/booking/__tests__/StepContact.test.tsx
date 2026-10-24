import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StepContact, StepContactProps } from '../StepContact.tsx';
import { COUNTRY_CODES } from '../types.ts';

describe('StepContact Component', () => {
  const defaultProps: StepContactProps = {
    name: '',
    setName: vi.fn(),
    email: '',
    setEmail: vi.fn(),
    selectedCountry: COUNTRY_CODES[0],
    setSelectedCountry: vi.fn(),
    phoneNational: '',
    setPhoneNational: vi.fn(),
    showGuests: false,
    setShowGuests: vi.fn(),
    guests: '',
    setGuests: vi.fn(),
    currentWebsite: '',
    setCurrentWebsite: vi.fn(),
    errorMsg: '',
    onNext: vi.fn(),
  };

  it('renders required input fields: name, email, phone', () => {
    render(<StepContact {...defaultProps} />);

    expect(screen.getByPlaceholderText('e.g. Alex Morgan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(555) 000-0000')).toBeInTheDocument();
    expect(screen.getByText('Google Meet')).toBeInTheDocument();
  });

  it('handles input text modifications', () => {
    render(<StepContact {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('e.g. Alex Morgan');
    fireEvent.change(nameInput, { target: { value: 'Jordan Hayes' } });
    expect(defaultProps.setName).toHaveBeenCalledWith('Jordan Hayes');

    const emailInput = screen.getByPlaceholderText('alex@company.com');
    fireEvent.change(emailInput, { target: { value: 'jordan@brand.com' } });
    expect(defaultProps.setEmail).toHaveBeenCalledWith('jordan@brand.com');
  });

  it('toggles guest input when Add guests is clicked', () => {
    const { rerender } = render(<StepContact {...defaultProps} showGuests={false} />);
    const addGuestsBtn = screen.getByText('Add guests');
    fireEvent.click(addGuestsBtn);
    expect(defaultProps.setShowGuests).toHaveBeenCalledWith(true);

    rerender(<StepContact {...defaultProps} showGuests={true} />);
    expect(screen.getByPlaceholderText('guest@company.com')).toBeInTheDocument();
  });

  it('calls onNext when Next button is clicked', () => {
    render(<StepContact {...defaultProps} />);
    const nextBtn = screen.getByText('Next: Project Details');
    fireEvent.click(nextBtn);
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it('displays error messages when provided', () => {
    render(<StepContact {...defaultProps} errorMsg="Please enter a valid email address" />);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });
});
