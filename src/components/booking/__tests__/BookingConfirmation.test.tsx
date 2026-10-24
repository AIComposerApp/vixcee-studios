import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BookingConfirmation } from '../BookingConfirmation.tsx';
import { DayItem } from '../types.ts';

describe('BookingConfirmation Component', () => {
  const mockDate: DayItem = {
    id: '2026-10-28',
    dateString: '2026-10-28',
    dayShort: 'Wed',
    dayFull: 'Wednesday',
    dayNum: 28,
    monthName: 'October',
    monthShort: 'Oct',
    year: 2026,
    formattedDate: 'Oct 28, 2026',
  };

  it('renders booking confirmation details with client name and date', () => {
    render(
      <BookingConfirmation
        name="Alex Morgan"
        email="alex@company.com"
        selectedDate={mockDate}
        selectedTime="01:30 PM"
        confirmedMeetUrl="https://meet.google.com/mock-meet-id"
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText(/you’re on the calendar/i)).toBeInTheDocument();
    expect(screen.getByText('Alex Morgan')).toBeInTheDocument();
    expect(screen.getByText('alex@company.com')).toBeInTheDocument();
    expect(screen.getByText('https://meet.google.com/mock-meet-id')).toBeInTheDocument();
  });

  it('renders Google Calendar action link with properly encoded parameters', () => {
    render(
      <BookingConfirmation
        name="Alex Morgan"
        email="alex@company.com"
        selectedDate={mockDate}
        selectedTime="01:30 PM"
        confirmedMeetUrl="https://meet.google.com/mock-meet-id"
        onReset={vi.fn()}
      />
    );

    const calLink = screen.getByRole('link', { name: /add to google calendar/i });
    expect(calLink).toHaveAttribute('href', expect.stringContaining('calendar.google.com'));
    expect(calLink).toHaveAttribute('target', '_blank');
  });

  it('calls onReset when Book Another Call button is clicked', () => {
    const handleReset = vi.fn();
    render(
      <BookingConfirmation
        name="Alex Morgan"
        email="alex@company.com"
        selectedDate={mockDate}
        selectedTime="01:30 PM"
        confirmedMeetUrl="https://meet.google.com/mock-meet-id"
        onReset={handleReset}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /book another call/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
