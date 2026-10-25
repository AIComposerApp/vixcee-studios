import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingSection } from '../BookingSection.tsx';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'test-user' } })),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback({ uid: 'test-user' });
    return () => {};
  }),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test-doc-id' })),
  onSnapshot: vi.fn((_query, callback) => {
    callback({ forEach: vi.fn() });
    return () => {};
  }),
  query: vi.fn(),
}));

describe('BookingSection', () => {
  it('renders booking section headline and step 1 fields', () => {
    render(<BookingSection />);
    expect(screen.getAllByText(/Your/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('e.g. Alex Morgan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('alex@company.com')).toBeInTheDocument();
  });

  it('validates step 1 when attempting to proceed without required fields', () => {
    render(<BookingSection />);
    const continueBtn = screen.getByRole('button', { name: /next: project details/i });
    fireEvent.click(continueBtn);
    expect(screen.getByText(/Please enter your full name/i)).toBeInTheDocument();
  });

  it('navigates to step 2 when step 1 inputs are valid', () => {
    render(<BookingSection />);
    const nameInput = screen.getByPlaceholderText('e.g. Alex Morgan');
    const emailInput = screen.getByPlaceholderText('alex@company.com');

    fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } });
    fireEvent.change(emailInput, { target: { value: 'alex@company.com' } });

    const continueBtn = screen.getByRole('button', { name: /next: project details/i });
    fireEvent.click(continueBtn);

    expect(screen.getByText(/Project Details/i)).toBeInTheDocument();
  });
});
