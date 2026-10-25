import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestimonialsSection } from '../TestimonialsSection.tsx';

describe('TestimonialsSection', () => {
  it('renders testimonials heading and review cards', () => {
    render(<TestimonialsSection />);
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText(/What clients and developers say/i)).toBeInTheDocument();
  });
});
