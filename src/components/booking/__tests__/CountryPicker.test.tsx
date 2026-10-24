import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CountryPicker } from '../CountryPicker.tsx';
import { COUNTRY_CODES } from '../types.ts';

describe('CountryPicker Component', () => {
  const defaultCountry = COUNTRY_CODES[0]; // United States (+1)

  it('renders country trigger with default dial code and flag', () => {
    render(
      <CountryPicker
        selectedCountry={defaultCountry}
        onSelectCountry={vi.fn()}
        phoneNational=""
        onChangePhoneNational={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /select country code/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('+1');
  });

  it('opens country dropdown on trigger click and searches countries', () => {
    const handleSelect = vi.fn();
    render(
      <CountryPicker
        selectedCountry={defaultCountry}
        onSelectCountry={handleSelect}
        phoneNational=""
        onChangePhoneNational={vi.fn()}
      />
    );

    const trigger = screen.getByRole('button', { name: /select country code/i });
    fireEvent.click(trigger);

    // Search input should appear
    const searchInput = screen.getByPlaceholderText(/search country or code/i);
    expect(searchInput).toBeInTheDocument();

    // Type query
    fireEvent.change(searchInput, { target: { value: 'Nigeria' } });
    const nigeriaBtn = screen.getByText('Nigeria');
    expect(nigeriaBtn).toBeInTheDocument();

    fireEvent.click(nigeriaBtn);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Nigeria', dial: '+234' })
    );
  });

  it('propagates phone number input changes', () => {
    const handleChangePhone = vi.fn();
    render(
      <CountryPicker
        selectedCountry={defaultCountry}
        onSelectCountry={vi.fn()}
        phoneNational=""
        onChangePhoneNational={handleChangePhone}
      />
    );

    const input = screen.getByPlaceholderText('(555) 000-0000');
    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(handleChangePhone).toHaveBeenCalledWith('1234567890');
  });
});
